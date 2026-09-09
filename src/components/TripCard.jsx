import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Users, Calendar, MapPin } from 'lucide-react';
import { formatDateShort, getStatusColor } from '../data/mockData';
import { springs } from '../animations/presets';

export default function TripCard({ trip, index = 0 }) {
  const navigate = useNavigate();

  // Progress for trip dates
  const totalDays = trip.start_date && trip.end_date ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (86400000)) + 1 : 0;
  const daysLeft = trip.start_date ? Math.ceil((new Date(trip.end_date) - new Date()) / 86400000) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ...springs.gentle }}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/trip/${trip.id}/overview`)}
      style={{
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        marginBottom: 'var(--space-4)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
      }}
    >
      {/* Cover Image — premium with shimmer + gradient */}
      <div className="shimmer-card" style={{ position: 'relative', height: 148, overflow: 'hidden' }}>
        <motion.img whileHover={{ scale: 1.06 }} transition={{ duration: 0.6 }} src={trip.cover_image_url || '/images/kashi.png'} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.55) 100%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18), transparent 45%)' }} />
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

      {/* Card body — with mini progress + members */}
      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span style={{ display:'flex', alignItems:'center', gap:6, background:'var(--color-primary-bg)', color:'var(--color-primary)', padding:'4px 10px', borderRadius:'var(--radius-full)', fontSize:'var(--font-size-xs)', fontWeight:700 }}><Calendar size={12} /> {formatDateShort(trip.start_date)} – {formatDateShort(trip.end_date)}</span>
          <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--color-text-secondary)', fontSize:'var(--font-size-sm)' }}><Users size={14} /> {trip.trip_members?.length || 0} Members</span>
          {trip.destination && <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--color-text-secondary)', fontSize:'var(--font-size-sm)' }}><MapPin size={14} /> {trip.destination.split(',')[0]}</span>}
        </div>
        {/* Days-left bar */}
        <div style={{ height:6, background:'var(--color-border)', borderRadius:999, overflow:'hidden', marginTop:12 }}>
          <motion.div initial={{ width:0 }} animate={{ width: daysLeft>0 && totalDays ? `${Math.max(12, Math.min(100, ((totalDays-daysLeft)/totalDays)*100))}%` : '45%' }} transition={{ duration:0.8, delay: 0.2+index*0.05 }} style={{ height:'100%', background:'var(--gradient-primary)' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)' }}><span>{totalDays||'—'} days</span><span>{daysLeft>0 ? `${daysLeft} days left` : 'Enjoy!'}</span></div>
      </div>
    </motion.div>
  );
}
