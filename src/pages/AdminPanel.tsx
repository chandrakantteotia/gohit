import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPanel: React.FC = () => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is not logged in, show login form
  if (!currentUser) {
    return <AdminLogin />;
  }

  // If user is logged in but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have admin privileges to access this panel.</p>
          <p className="text-sm text-gray-500">Contact the administrator if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  // If user is admin, show dashboard
  return <AdminDashboard />;
};

export default AdminPanel;