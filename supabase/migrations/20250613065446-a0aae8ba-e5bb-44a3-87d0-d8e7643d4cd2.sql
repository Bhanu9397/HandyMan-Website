-- Create user roles enum
CREATE TYPE user_role AS ENUM ('customer', 'handyman', 'admin');

-- Create profiles table for extended user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create handyman_profiles table for additional handyman info
CREATE TABLE public.handyman_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  bio TEXT,
  years_experience INTEGER,
  hourly_rate DECIMAL(10,2),
  availability TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_price DECIMAL(10,2),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id BIGSERIAL PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) NOT NULL,
  handyman_id UUID REFERENCES handyman_profiles(id),
  service_id BIGINT REFERENCES services(id) NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  description TEXT,
  address TEXT NOT NULL,
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact inquiries table
CREATE TABLE public.inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO public.services (name, description, category, base_price) VALUES
('Plumbing Repair', 'Fix leaks, unclog drains, repair faucets and water heaters', 'Plumbing', 300.00),
('Electrical Work', 'Install outlets, switches, light fixtures, and electrical repairs', 'Electrical', 400.00),
('Carpentry Services', 'Custom furniture, door repairs, and wooden work', 'Carpentry', 350.00),
('Painting Services', 'Interior and exterior painting, wall textures', 'Painting', 250.00),
('AC Service & Repair', 'AC installation, maintenance, and repair', 'HVAC', 500.00),
('Deep Cleaning', 'Complete home cleaning, sanitization, and pest control', 'Cleaning', 200.00),
('Appliance Repair', 'Repair of refrigerators, washing machines, and other appliances', 'Appliance Repair', 450.00),
('Garden Maintenance', 'Lawn care, plant maintenance, and garden design', 'Landscaping', 300.00),
('Kitchen Repair', 'Modular kitchen repairs, cabinet fixing, and plumbing', 'Kitchen Repair', 400.00),
('Furniture Assembly', 'Assemble and repair furniture, modular units', 'Furniture Repair', 350.00),
('Mobile Repair', 'Smartphone and tablet repair services', 'Mobile Repair', 200.00),
('TV Installation', 'Smart TV setup, wall mounting, and cable management', 'TV Installation', 300.00),
('Internet Setup', 'WiFi installation, network setup, and troubleshooting', 'Internet Setup', 250.00),
('Security Installation', 'CCTV cameras, door locks, and security systems', 'Security Installation', 600.00),
('Home Maintenance', 'General repairs, maintenance, and handyman services', 'Home Maintenance', 300.00);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handyman_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for handyman_profiles
CREATE POLICY "Anyone can view active handyman profiles" ON public.handyman_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Handymen can update their own profile" ON public.handyman_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can manage all handyman profiles" ON public.handyman_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for bookings
CREATE POLICY "Customers can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Handymen can view their assigned bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.handyman_profiles WHERE id = bookings.handyman_id
    )
  );

CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Handymen can update their bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.handyman_profiles WHERE id = bookings.handyman_id
    )
  );

CREATE POLICY "Admin can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for inquiries
CREATE POLICY "Anyone can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage inquiries" ON public.inquiries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  
  -- If user is registering as handyman, create handyman profile
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer') = 'handyman' THEN
    INSERT INTO public.handyman_profiles (id, business_name, bio)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'business_name', 'New Handyman Business'),
      'New handyman ready to help with your home improvement needs!'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('handyman-images', 'handyman-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view handyman images" ON storage.objects
  FOR SELECT USING (bucket_id = 'handyman-images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'handyman-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'handyman-images' AND auth.uid()::text = (storage.foldername(name))[1]);
