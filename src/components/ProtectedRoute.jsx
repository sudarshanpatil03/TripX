import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Plane } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)' }}>
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Plane size={48} color="var(--color-primary)" />
        </motion.div>
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontWeight: 600 }}>Loading TripX...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
