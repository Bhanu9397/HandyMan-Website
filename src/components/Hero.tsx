import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const [stats, setStats] = useState({
    providers: 0,
    categories: 0,
    customers: 0,
    rating: 4.8,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStats(s => ({ ...s, loading: true }));
      const [{ count: providers }, { count: categories }] = await Promise.all([
        supabase.from('handyman_profiles').select('id', { count: 'exact' }),
        supabase.from('services').select('category', { count: 'exact', distinct: true }),
      ]);
      setStats(s => ({
        ...s,
        providers: providers || 0,
        categories: categories || 0,
        customers: 100000, // Placeholder, replace with real if available
        rating: 4.8,
        loading: false,
      }));
    };
    fetchStats();
  }, []);

  const popularServices = [
    { name: 'Plumbing', icon: '🔧', href: '#services' },
    { name: 'Electrical', icon: '⚡', href: '#services' },
    { name: 'Cleaning', icon: '🧹', href: '#services' },
    { name: 'Painting', icon: '🎨', href: '#services' },
    { name: 'Carpentry', icon: '🪚', href: '#services' },
    { name: 'AC Repair', icon: '❄️', href: '#services' },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Find Trusted Providers Near You
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Connect directly with verified professionals for all your home service needs with Handyman
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative max-w-2xl mx-auto mb-12"
          >
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
              <div className="flex-1 flex items-center px-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
                />
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for services"
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
                />
              </div>
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300">
                Search
              </button>
            </div>
          </motion.div>

          {/* Popular Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {popularServices.map((service, index) => (
              <Link
                key={service.name}
                to={service.href}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <h3 className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-primary dark:group-hover:text-primary">
                    {service.name}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.loading ? (
              <div className="col-span-4 text-center text-gray-400">Loading stats...</div>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.providers}+</div>
                  <div className="text-gray-600 dark:text-gray-400">Verified Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.categories}+</div>
                  <div className="text-gray-600 dark:text-gray-400">Service Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.customers.toLocaleString()}+</div>
                  <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.rating}</div>
                  <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
