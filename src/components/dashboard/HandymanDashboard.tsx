
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, MapPin, DollarSign, User, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Tables } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'> & {
  services: Tables<'services'>;
  profiles: Tables<'profiles'>;
};

const HandymanDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [handymanProfile, setHandymanProfile] = useState<Tables<'handyman_profiles'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        supabase
          .from('bookings')
          .select(`
            *,
            services (*),
            profiles!bookings_customer_id_fkey (*)
          `)
          .eq('handyman_id', user?.id)
          .order('booking_date', { ascending: true }),
        
        supabase
          .from('handyman_profiles')
          .select('*')
          .eq('id', user?.id)
          .single()
      ]);
      
      if (bookingsRes.error) throw bookingsRes.error;
      if (profileRes.error) throw profileRes.error;
      
      setBookings(bookingsRes.data || []);
      setHandymanProfile(profileRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
      
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error updating booking:', error);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Handyman Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Rating</p>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-500 fill-current" />
                <span className="font-semibold">{handymanProfile?.rating}/5.0</span>
              </div>
              <p className="text-xs text-gray-500">{handymanProfile?.total_jobs} jobs completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {handymanProfile && !handymanProfile.is_verified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-800 font-medium mb-1">Account Under Review</h3>
            <p className="text-yellow-700 text-sm">
              Your handyman profile is currently being reviewed by our admin team. You'll be able to accept bookings once verified.
            </p>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>

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
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm">Customer: {booking.profiles?.full_name}</span>
                    </div>
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
                  </div>
                  
                  {booking.description && (
                    <p className="text-gray-600 text-sm">
                      {booking.description}
                    </p>
                  )}
                </div>
                
                {handymanProfile?.is_verified && (
                  <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-6">
                    {booking.status === 'pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateBookingStatus(booking.id, 'accepted')}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Decline
                        </motion.button>
                      </>
                    )}
                    
                    {booking.status === 'accepted' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                        className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Start Work
                      </motion.button>
                    )}
                    
                    {booking.status === 'in_progress' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Complete
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {bookings.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500">New bookings will appear here when customers book your services.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandymanDashboard;
