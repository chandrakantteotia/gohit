import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPanel: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!currentUser) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

export default AdminPanel;
