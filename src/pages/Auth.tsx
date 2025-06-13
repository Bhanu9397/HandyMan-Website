
import React, { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import AuthModal from '@/components/auth/AuthModal';

const Auth: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthModal isOpen={true} onClose={() => {}} />
    </div>
  );
};

export default Auth;
