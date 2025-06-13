
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth/AuthProvider';
import { Tables } from '@/integrations/supabase/types';

type Service = Tables<'services'>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onBookingSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  service, 
  onBookingSuccess 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    booking_date: '',
    address: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to book a service');
      return;
    }

    if (!service) {
      setError('No service selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          customer_id: user.id,
          service_id: service.id,
          booking_date: formData.booking_date,
          address: formData.address,
          description: formData.description,
          estimated_cost: service.base_price
        }]);

      if (bookingError) throw bookingError;

      onBookingSuccess();
      setFormData({ booking_date: '', address: '', description: '' });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Book {service.name}
              </h2>
              <p className="text-gray-600">
                Starting at ${service.base_price}
              </p>
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  Please sign in to book a service.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} />
                  <span>Preferred Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  disabled={!user}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  value={formData.booking_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, booking_date: e.target.value }))}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={16} />
                  <span>Service Address</span>
                </label>
                <textarea
                  required
                  disabled={!user}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter the full address where service is needed"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare size={16} />
                  <span>Description (Optional)</span>
                </label>
                <textarea
                  disabled={!user}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Describe what needs to be done..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading || !user}
                whileHover={{ scale: user ? 1.02 : 1 }}
                whileTap={{ scale: user ? 0.98 : 1 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : (user ? 'Book Now' : 'Sign In Required')}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>We'll contact you to confirm your booking and provide a detailed quote.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
