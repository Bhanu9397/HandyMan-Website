
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Inquiry = Tables<'inquiries'>;

interface InquiriesManagerProps {
  onUpdate: () => void;
}

const InquiriesManager: React.FC<InquiriesManagerProps> = ({ onUpdate }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      loadInquiries();
      onUpdate();
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Customer Inquiries</h2>
      
      <div className="grid gap-6">
        {inquiries.map((inquiry, index) => (
          <motion.div
            key={inquiry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {inquiry.subject || 'General Inquiry'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(inquiry.status || 'new')}`}>
                    {inquiry.status || 'new'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm">{inquiry.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{inquiry.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    <span className="text-sm">From: {inquiry.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm">{inquiry.message}</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                {inquiry.status === 'new' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateInquiryStatus(inquiry.id, 'in_progress')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Mark In Progress
                  </motion.button>
                )}
                
                {inquiry.status !== 'resolved' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateInquiryStatus(inquiry.id, 'resolved')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <CheckCircle size={16} />
                    <span>Mark Resolved</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {inquiries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No inquiries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesManager;
