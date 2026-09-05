import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { Plus, Crown, User, ShieldAlert } from 'lucide-react';
import AnimatedButton from '../../components/AnimatedButton';
import { springs, staggerContainer, fadeInUp } from '../../animations/presets';

export default function MembersList() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();

  if (!trip) return null;

  const members = (trip.trip_members || []).filter(m => m.role !== 'removed');

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text)' }}>
            Members
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Manage who has access to this trip.
          </p>
        </div>
        <AnimatedButton onClick={() => navigate('add')}>
          <Plus size={18} style={{ marginRight: 8 }} />
          Invite
        </AnimatedButton>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        {members.map((member) => (
          <motion.div
            key={member.user_id}
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            style={{
              background: 'var(--color-surface)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--color-border)',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {member.users?.avatar_url ? (
                  <img src={member.users.avatar_url} alt={member.users?.name || 'Member'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={24} style={{ color: 'var(--color-primary)' }} />
                )}
              </div>
              
              <div>
                <h3 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--font-size-base)' }}>
                  {member.users?.name || 'Unknown User'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                  {member.role === 'owner' && <Crown size={14} style={{ color: '#F59E0B' }} />}
                  {member.role === 'admin' && <ShieldAlert size={14} style={{ color: 'var(--color-primary)' }} />}
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', textTransform: 'capitalize' }}>
                    {member.role}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Future: Add menu to remove/change permissions if you are owner */}
          </motion.div>
        ))}

        {members.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            No members found.
          </div>
        )}
      </motion.div>
    </div>
  );
}
