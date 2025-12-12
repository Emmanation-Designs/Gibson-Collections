import React from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ADMIN_EMAILS } from '../types';

export const AdminFab: React.FC = () => {
  const { user } = useStore();

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return null;
  }

  return (
    <Link 
      to="/admin/upload"
      className="fixed bottom-20 md:bottom-8 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition-transform hover:scale-105"
      aria-label="Upload Product"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
};
