
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
import HandymanDashboard from '@/components/dashboard/HandymanDashboard';

const Dashboard: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  switch (profile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'handyman':
      return <HandymanDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default Dashboard;
