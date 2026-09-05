import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Share2 } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';
import { springs, fadeInUp } from '../animations/presets';
import { useTrips } from '../context/TripContext';

export default function TripCreated() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trips, refreshTrips } = useTrips();
  const tripId = location.state?.tripId;

  useEffect(() => {
    if (!tripId) {
      navigate('/');
    } else {
      // Ensure trips list is fresh
      refreshTrips();
    }
  }, [tripId, navigate, refreshTrips]);

  const trip = trips.find(t => t.id === tripId);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'var(--color-bg)',
      textAlign: 'center'
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={springs.bouncy}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--color-primary-bg)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-6)'
        }}
      >
        <CheckCircle size={40} />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        style={{ maxWidth: 400, width: '100%' }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
          Trip Created!
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          {trip ? `Your trip to ${trip.destination} is set.` : "Your trip is ready to go."} Time to invite friends and start planning.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <AnimatedButton onClick={() => navigate(`/trip/${tripId}/overview`)} fullWidth>
            Enter Trip Workspace <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </AnimatedButton>
          <AnimatedButton variant="outline" onClick={() => navigate(`/trip/${tripId}/members/add`)} fullWidth>
            <Share2 size={18} style={{ marginRight: 8 }} /> Invite Members
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  );
}