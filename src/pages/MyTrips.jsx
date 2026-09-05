import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Settings, User } from 'lucide-react';
import FilterTabs from '../components/FilterTabs';
import TripCard from '../components/TripCard';
import NotificationsDropdown from '../components/NotificationsDropdown';
import { fadeInUp, staggerContainer } from '../animations/presets';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
];

export default function MyTrips() {
  const navigate = useNavigate();
  const { trips, loading } = useTrips();
  const { user, profile } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTrips = trips.filter(
    (t) => activeFilter === 'all' || t.status === activeFilter
  );

  const displayName = profile?.name || user?.user_metadata?.full_name?.split(' ')[0] || 'Traveler';

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: 'calc(var(--nav-height) + var(--space-6))' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            TripX
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Welcome back, {displayName}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <NotificationsDropdown />
          <button 
            onClick={() => navigate('/profile')}
            style={{ 
              background: 'var(--color-primary-bg)', border: '2px solid var(--color-surface)', 
              width: 40, height: 40, borderRadius: '50%', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={20} />
            )}
          </button>
        </div>
      </header>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <FilterTabs tabs={filterOptions} activeTab={activeFilter} onChange={setActiveFilter} />
      </div>

      <button 
        onClick={() => navigate('/create-trip')}
        style={{
          width: '100%',
          padding: 'var(--space-4)',
          background: 'var(--color-surface)',
          border: '2px dashed var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-primary)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
          cursor: 'pointer'
        }}
      >
        <Plus size={20} />
        Plan a New Trip
      </button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          Loading trips...
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
            {filteredTrips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}
              >
                No trips found. Time to plan one!
              </motion.div>
            ) : (
              filteredTrips.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}