
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, MapPin, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'> & {
  profiles: Tables<'profiles'>;
  services: Tables<'services'>;
  handyman_profiles?: Tables<'handyman_profiles'> & {
    profiles: Tables<'profiles'>;
  };
};

interface BookingsManagerProps {
  onUpdate: () => void;
}

const BookingsManager: React.FC<BookingsManagerProps> = ({ onUpdate }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!bookings_customer_id_fkey (*),
          services (*),
          handyman_profiles (
            *,
            profiles (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      loadBookings();
      onUpdate();
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
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Bookings Management</h2>
      
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
                    Booking #{booking.id}
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
                      Service: {booking.services?.name} (${booking.services?.base_price})
                    </span>
                  </div>
                </div>
                
                {booking.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    Description: {booking.description}
                  </p>
                )}
                
                {booking.handyman_profiles && (
                  <div className="text-sm text-gray-600">
                    Assigned to: {booking.handyman_profiles.profiles?.full_name}
                  </div>
                )}
              </div>
              
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
                      Cancel
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
            </div>
          </motion.div>
        ))}
        
        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsManager;
