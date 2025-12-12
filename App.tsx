import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Upload } from './pages/Upload';
import { Cart } from './pages/Cart';
import { AdminFab } from './components/AdminFab';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const { setUser } = useStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUser({ id: session.user.id, email: session.user.email });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUser({ id: session.user.id, email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/upload" element={<Upload />} />
          <Route path="/profile" element={<div className="text-center py-10 font-medium">My Profile Settings (Coming Soon)</div>} />
          <Route path="/wishlist" element={<div className="text-center py-10 font-medium">My Wishlist (Coming Soon)</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AdminFab />
      </Layout>
    </Router>
  );
};

export default App;
