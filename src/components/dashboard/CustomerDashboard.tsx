
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, MapPin, DollarSign, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Tables } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'> & {
  services: Tables<'services'>;
  handyman_profiles?: Tables<'handyman_profiles'> & {
    profiles: Tables<'profiles'>;
  };
};

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (*),
          handyman_profiles (
            *,
            profiles (*)
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Manage your bookings and services</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
          <motion.a
            href="/#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Book New Service</span>
          </motion.a>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.services?.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status || 'pending')}`}>
                      {booking.status || 'pending'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">
                        {new Date(booking.booking_date).toLocaleDateString()} at{' '}
                        {new Date(booking.booking_date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm">{booking.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="text-sm">
                        ${booking.estimated_cost || booking.services?.base_price}
                      </span>
                    </div>
                    {booking.handyman_profiles && (
                      <div className="flex items-center space-x-2">
                        <Star size={16} className="text-yellow-500" />
                        <span className="text-sm">
                          {booking.handyman_profiles.profiles?.full_name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {booking.description && (
                    <p className="text-gray-600 text-sm">
                      {booking.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {bookings.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-4">Start by booking your first service</p>
              <motion.a
                href="/#services"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Browse Services</span>
              </motion.a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
