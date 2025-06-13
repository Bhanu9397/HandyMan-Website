
-- First, let's check if the user_role type exists and create it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'handyman', 'admin');
    END IF;
END $$;

-- Fix the RLS policies to avoid infinite recursion
-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all handyman profiles" ON public.handyman_profiles;
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "Admin can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can manage inquiries" ON public.inquiries;

-- Create a function to check if user is admin (avoiding recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND raw_user_meta_data->>'role' = 'admin'
  );
$$;

-- Recreate admin policies using the function
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can manage all handyman profiles" ON public.handyman_profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can manage services" ON public.services
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can manage all bookings" ON public.bookings
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin can manage inquiries" ON public.inquiries
  FOR ALL USING (public.is_admin());

-- Ensure handyman profiles can be created
CREATE POLICY "Handymen can create their own profile" ON public.handyman_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
  );
  
  -- If user is registering as handyman, create handyman profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'handyman' THEN
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
