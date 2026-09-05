import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { ArrowLeft, Clock, Activity, User as UserIcon } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { staggerContainer, fadeInUp } from '../../animations/presets';

export default function ActivityHistory() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();

  if (!trip) return null;

  const activities = [...(trip.activity_history || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(d);
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 600, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Activity History
            </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Recent events in this trip</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            <Activity size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
            <p>No activity recorded yet.</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: 'var(--color-border)', zIndex: 0 }} />
            
            {activities.map((activity, index) => {
              // Find the user who did the action
              const userMember = trip.trip_members?.find(m => m.user_id === activity.user_id);
              const userName = userMember?.users?.name || 'A member';
              const userAvatar = userMember?.users?.avatar_url;

              return (
                <motion.div
                  key={activity.id || index}
                  variants={fadeInUp}
                  style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative', zIndex: 1, marginBottom: 'var(--space-4)' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon size={20} color="var(--color-text-muted)" />
                    )}
                  </div>
                  
                  <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', flex: 1, border: '1px solid var(--color-border)' }}>
                    <p style={{ margin: 0, color: 'var(--color-text)', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ fontWeight: 600 }}>{userName}</span> {activity.action_description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                      <Clock size={12} />
                      {formatTime(activity.created_at)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}