import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Users, Calendar, MapPin } from 'lucide-react';
import { formatDateShort, getStatusColor } from '../data/mockData';
import { springs } from '../animations/presets';

export default function TripCard({ trip, index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ...springs.gentle }}
      whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(124, 58, 237, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/trip/${trip.id}/overview`)}
      style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        marginBottom: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Cover Image */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <img
          src={trip.cover_image_url || '/images/kashi.png'}
          alt={trip.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        {/* Status badge */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, ...springs.bouncy }}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            background: getStatusColor(trip.status),
            color: 'white',
            textTransform: 'capitalize',
          }}
        >
          {trip.status}
        </motion.span>
        {/* Trip name over image */}
        <h3
          style={{
            position: 'absolute',
            bottom: 12,
            left: 16,
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: 700,
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {trip.name}
        </h3>
      </div>

      {/* Card body */}
      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <Calendar size={14} />
            <span>{formatDateShort(trip.start_date)} – {formatDateShort(trip.end_date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <Users size={14} />
            <span>{trip.trip_members?.length || 0} Members</span>
          </div>
          {trip.destination && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <MapPin size={14} />
              <span>{trip.destination.split(',')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
