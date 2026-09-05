import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { Crown, User, ShieldAlert, Trash2, ChevronDown, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import AnimatedButton from '../../components/AnimatedButton';
import { springs, staggerContainer, fadeInUp } from '../../animations/presets';
import ThemeToggle from '../../components/ThemeToggle';

export default function Permissions() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();
  const { updateMemberRole, removeMember } = useTrips();
  const { user: currentUser } = useAuth();
  
  const [loadingAction, setLoadingAction] = useState(null); // 'user_id-action'

  if (!trip) return null;

  const members = (trip.trip_members || []).filter(m => m.role !== 'removed');
  
  // Check if current user is owner or admin
  const currentUserRole = members.find(m => m.user_id === currentUser?.id)?.role;
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  const handleRoleChange = async (userId, newRole) => {
    setLoadingAction(`${userId}-role`);
    try {
      await updateMemberRole(trip.id, userId, newRole);
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    setLoadingAction(`${userId}-remove`);
    try {
      await removeMember(trip.id, userId);
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Permissions
            </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
              Manage member roles and access.
            </p>
      </div>

      {!canManage && (
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
          Only trip owners and admins can manage permissions.
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        {members.map((member) => {
          const isOwner = member.role === 'owner';
          const isMe = member.user_id === currentUser?.id;
          
          return (
            <motion.div
              key={member.user_id}
              variants={fadeInUp}
              style={{
                background: 'var(--color-surface)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                justifyContent: 'space-between',
                opacity: loadingAction?.startsWith(member.user_id) ? 0.6 : 1
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
                  <h3 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--font-size-base)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {member.users?.name || 'Unknown User'}
                    {isMe && <span style={{ fontSize: '10px', background: 'var(--color-bg)', padding: '2px 6px', borderRadius: 10 }}>You</span>}
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
              
              {canManage && !isOwner && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <select 
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                    disabled={loadingAction != null}
                    style={{
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  <AnimatedButton
                    variant="outline"
                    onClick={() => handleRemove(member.user_id)}
                    disabled={loadingAction != null}
                    style={{ padding: 'var(--space-2)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={16} />
                  </AnimatedButton>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}