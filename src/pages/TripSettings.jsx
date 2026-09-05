import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Info,
  ImageIcon,
  Calendar,
  Wallet,
  Bell,
  ChevronRight,
} from 'lucide-react';
import MemberAvatar from '../components/MemberAvatar';
import ThemeToggle from '../components/ThemeToggle';
import { staggerContainer, fadeInUp, fadeInRight, springs } from '../animations/presets';

const settingsItems = [
  { icon: Info, label: 'Trip Info' },
  { icon: ImageIcon, label: 'Trip Image' },
  { icon: Calendar, label: 'Dates & Destination' },
  { icon: Wallet, label: 'Budget' },
  { icon: Bell, label: 'Notification Settings' },
];

export default function TripSettings() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();

  if (!trip) return null;

  const permissionsData = trip.trip_members?.map(m => ({
    name: m.users?.name || 'Unknown',
    role: m.role === 'owner' ? 'Full Access' : m.role === 'admin' ? 'Can Edit, Add Expenses' : 'Member',
    isOwner: m.role === 'owner',
    avatarUrl: m.users?.avatar_url
  })) || [];

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div className="page-content" style={{ paddingTop: 'var(--space-2)' }}>
        {/* Settings Menu */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {settingsItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className="settings-item"
                variants={fadeInUp}
                whileHover={{
                  backgroundColor: 'var(--color-surface-hover)',
                  x: 4,
                }}
                whileTap={{ scale: 0.99 }}
                transition={springs.gentle}
                style={{ cursor: 'pointer' }}
              >
                <div className="settings-item__icon">
                  <Icon size={20} />
                </div>
                <span className="settings-item__label">{item.label}</span>
                <motion.div
                  className="settings-item__chevron"
                  whileHover={{ x: 3 }}
                >
                  <ChevronRight size={18} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider */}
        <motion.div
          className="divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ transformOrigin: 'left', margin: '0 var(--space-5)' }}
        />

        {/* Permissions Section */}
        <motion.div
          style={{ padding: '0 var(--space-5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h2 className="section-title" style={{ marginBottom: 'var(--space-1)' }}>
            Permissions
          </h2>
          <p className="section-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
            Manage what members can do
          </p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            transition={{ delayChildren: 0.6 }}
          >
            {permissionsData.map((member) => (
              <motion.div
                key={member.name}
                className="member-item"
                variants={fadeInRight}
                whileHover={{
                  x: 4,
                  backgroundColor: 'var(--color-surface-hover)',
                }}
                transition={springs.gentle}
                style={{
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  marginBottom: 'var(--space-1)',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary-bg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {member.avatarUrl ? <img src={member.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{member.name.charAt(0)}</span>}
                </div>
                <div className="member-info">
                  <div className="member-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {member.name}
                  </div>
                  <div className="member-subtitle">{member.role}</div>
                </div>
                {member.isOwner ? (
                  <motion.span
                    className="crown-icon"
                    animate={{
                      y: [0, -3, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ fontSize: '1.5rem' }}
                  >
                    👑
                  </motion.span>
                ) : (
                  <motion.div whileHover={{ x: 3 }}>
                    <ChevronRight size={18} color="var(--color-text-muted)" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
