
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Wrench, Calendar, MessageSquare, Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import ServicesManager from './ServicesManager';
import HandymanManager from './HandymanManager';
import BookingsManager from './BookingsManager';
import InquiriesManager from './InquiriesManager';

type Service = Tables<'services'>;
type HandymanProfile = Tables<'handyman_profiles'> & {
  profiles: Tables<'profiles'>;
};
type Booking = Tables<'bookings'>;
type Inquiry = Tables<'inquiries'>;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalHandymen: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalInquiries: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [handymenRes, bookingsRes, inquiriesRes] = await Promise.all([
        supabase.from('handyman_profiles').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id, status', { count: 'exact' }),
        supabase.from('inquiries').select('id', { count: 'exact' })
      ]);

      const pendingBookings = bookingsRes.data?.filter(b => b.status === 'pending').length || 0;

      setStats({
        totalHandymen: handymenRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        pendingBookings,
        totalInquiries: inquiriesRes.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'handymen', label: 'Handymen', icon: Wrench },
    { id: 'services', label: 'Services', icon: Plus },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare }
  ];

  const statCards = [
    { title: 'Total Handymen', value: stats.totalHandymen, icon: Wrench, color: 'bg-blue-500' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-green-500' },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: Clock, color: 'bg-yellow-500' },
    { title: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your handyman platform</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color} text-white`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'handymen' && <HandymanManager onUpdate={loadStats} />}
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'bookings' && <BookingsManager onUpdate={loadStats} />}
        {activeTab === 'inquiries' && <InquiriesManager onUpdate={loadStats} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
