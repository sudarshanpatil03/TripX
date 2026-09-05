import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { 
  Settings, 
  ShieldAlert, 
  MapPin, 
  Home, 
  Plane, 
  History, 
  Image as ImageIcon, 
  Flag,
  ChevronRight
} from 'lucide-react';
import { staggerContainer, fadeInUp, springs } from '../../animations/presets';

export default function TripMore() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();

  if (!trip) return null;

  const menuGroups = [
    {
      title: "Plan & Explore",
      items: [
        { label: 'Explore Places', icon: MapPin, path: 'places', color: 'var(--color-primary)' },
        { label: 'Accommodation', icon: Home, path: 'stay', color: 'var(--color-success)' },
        { label: 'Transportation', icon: Plane, path: 'transport', color: 'var(--color-warning)' },
      ]
    },
    {
      title: "Trip Features",
      items: [
        { label: 'Trip Memories', icon: ImageIcon, path: 'memories', color: 'var(--color-primary)' },
        { label: 'Activity History', icon: History, path: 'history', color: 'var(--color-text-secondary)' },
        { label: 'Complete Trip & Settle', icon: Flag, path: 'complete', color: 'var(--color-danger)' },
      ]
    },
    {
      title: "Management",
      items: [
        { label: 'Member Permissions', icon: ShieldAlert, path: 'permissions', color: 'var(--color-text)' },
        { label: 'Trip Settings', icon: Settings, path: 'settings', color: 'var(--color-text-muted)' },
      ]
    }
  ];

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 600, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          More
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
          Tools and settings for your trip
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
      >
        {menuGroups.map((group, gIdx) => (
          <motion.div key={gIdx} variants={fadeInUp}>
            <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', paddingLeft: 'var(--space-2)' }}>
              {group.title}
            </h3>
            
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                const isLast = iIdx === group.items.length - 1;
                
                return (
                  <motion.div
                    key={iIdx}
                    onClick={() => navigate(`/trip/${trip.id}/${item.path}`)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: 'var(--space-4)', 
                      borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      background: 'transparent'
                    }}
                    whileHover={{ background: 'var(--color-primary-bg)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={springs.gentle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <div style={{ color: item.color }}>
                        <Icon size={20} />
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{item.label}</span>
                    </div>
                    <ChevronRight size={18} color="var(--color-text-muted)" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
