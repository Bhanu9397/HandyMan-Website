
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Edit, Star, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type HandymanProfile = Tables<'handyman_profiles'> & {
  profiles: Tables<'profiles'>;
};

interface HandymanManagerProps {
  onUpdate: () => void;
}

const HandymanManager: React.FC<HandymanManagerProps> = ({ onUpdate }) => {
  const [handymen, setHandymen] = useState<HandymanProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHandymen();
  }, []);

  const loadHandymen = async () => {
    try {
      const { data, error } = await supabase
        .from('handyman_profiles')
        .select(`
          *,
          profiles (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setHandymen(data || []);
    } catch (error) {
      console.error('Error loading handymen:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHandymanStatus = async (id: string, updates: Partial<Tables<'handyman_profiles'>>) => {
    try {
      const { error } = await supabase
        .from('handyman_profiles')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      loadHandymen();
      onUpdate();
    } catch (error) {
      console.error('Error updating handyman:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading handymen...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Handymen Management</h2>
      
      <div className="grid gap-6">
        {handymen.map((handyman, index) => (
          <motion.div
            key={handyman.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {handyman.profiles?.full_name}
                  </h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      handyman.is_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {handyman.is_verified ? 'Verified' : 'Pending'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      handyman.is_active 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {handyman.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-2">{handyman.business_name}</p>
                <p className="text-gray-500 text-sm mb-3">{handyman.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{handyman.profiles?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{handyman.profiles?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star size={16} className="text-yellow-500" />
                    <span>{handyman.rating}/5.0 ({handyman.total_jobs} jobs)</span>
                  </div>
                </div>
                
                {handyman.years_experience && (
                  <p className="text-sm text-gray-500 mt-2">
                    Experience: {handyman.years_experience} years
                  </p>
                )}
                
                {handyman.hourly_rate && (
                  <p className="text-sm text-gray-500">
                    Hourly Rate: ${handyman.hourly_rate}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                {!handyman.is_verified && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateHandymanStatus(handyman.id, { is_verified: true })}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                    <span>Verify</span>
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateHandymanStatus(handyman.id, { is_active: !handyman.is_active })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    handyman.is_active
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {handyman.is_active ? (
                    <>
                      <XCircle size={18} />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Activate</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {handymen.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No handymen registered yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default HandymanManager;
