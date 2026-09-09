import { motion } from 'motion/react';
import { Outlet, useParams, useNavigate, useLocation, Link } from 'react-router';
import { useTrips } from '../context/TripContext';
import { useEffect, useState } from 'react';
import { ArrowLeft, LayoutGrid, Map, Receipt, Users, Plus, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { springs, floatingOrb } from '../animations/presets';
import TripChat from './TripChat';

const tripTabs = [
  { path: 'overview', label: 'Overview', icon: LayoutGrid },
  { path: 'itinerary', label: 'Plan', icon: Map },
  { path: 'expenses', label: 'Expenses', icon: Receipt },
  { path: 'members', label: 'Members', icon: Users },
  { path: 'more', label: 'Add', icon: Plus },
];

export default function TripWorkspaceLayout() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { trips, openTrip } = useTrips();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const trip = trips.find((t) => t.id === tripId);

  useEffect(() => {
    if (tripId) openTrip(tripId);
  }, [tripId, openTrip]);

  if (!trip) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Trip not found</p>
      </div>
    );
  }

  const currentMember = trip.trip_members?.find(m => m.user_id === user?.id);
  if (currentMember?.role === 'removed') {
    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-6)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>You have been removed from this trip by an administrator.</p>
        <button onClick={() => navigate('/')} className="btn btn--primary" style={{ border: 'none', background: 'var(--color-primary)', color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
          Return to My Trips
        </button>
      </div>
    );
  }

  const currentPath = location.pathname.split('/').pop();
  const rootPaths = ['overview', 'itinerary', 'expenses', 'members', 'more'];
  
  const handleBack = () => {
    if (rootPaths.includes(currentPath)) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="app-container">
      {/* Floating orbs */}
      <div className="bg-orbs">
        <motion.div className="bg-orb bg-orb--1" {...floatingOrb(0)} />
        <motion.div className="bg-orb bg-orb--2" {...floatingOrb(1.5)} />
      </div>

      <div className="main-content">
        {/* Trip Header — premium glass + progress */}
        <motion.header className="header" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} style={{ backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', borderBottom:'1px solid var(--glass-border)', background:'var(--glass-bg)' }}>
          <motion.button
            className="header__back"
            onClick={handleBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <motion.h1
            className="header__title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'var(--font-size-lg)' }}
          >
            {trip.name}
          </motion.h1>
          <ThemeToggle />
        </motion.header>

        {/* Page content */}
        <main>
          <Outlet context={{ trip, tripId }} />
        </main>
      </div>

      {/* Trip Bottom Nav — premium glass + glow */}
      <nav className="main-nav" style={{ overflow: 'visible', background:'var(--glass-bg)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderTop:'1px solid var(--glass-border)', boxShadow:'0 -8px 32px rgba(0,0,0,0.08)' }}>
        <div className="main-nav__list" style={{ position: 'relative' }}>
          {tripTabs.map((tab, idx) => {


            const isActive =
              currentPath === tab.path ||
              (tab.path === 'expenses' && ['add'].includes(currentPath));
            const Icon = tab.icon;

            return (
              <motion.div
                key={tab.path}
                className={`main-nav__item ${isActive ? 'active' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={springs.bouncy}
                onClick={() => navigate(`/trip/${tripId}/${tab.path}`)}
              >
                {isActive && (
                  <motion.div
                    layoutId="trip-nav-indicator"
                    className="nav-indicator"
                    transition={springs.bouncy}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0, color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                  transition={springs.bouncy}
                >
                  <Icon size={22} />
                </motion.div>
                <span className="main-nav__label" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{tab.label}</span>
              </motion.div>
            );
          })}
        </div>
      </nav>
      {/* Floating Chat Button */}
      {!isChatOpen && currentMember?.role !== 'removed' && (
        <motion.button
          onClick={() => setIsChatOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: 'calc(var(--nav-height) + var(--space-4))',
            right: 'var(--space-4)',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 90
          }}
        >
          <MessageSquare size={24} />
        </motion.button>
      )}

      {/* The Chat Drawer */}
      <TripChat tripId={tripId} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
