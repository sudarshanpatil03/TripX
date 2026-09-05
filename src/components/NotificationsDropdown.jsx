import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, X, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTrips } from '../context/TripContext';
import { fadeInUp } from '../animations/presets';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, respondToInvite, markNotificationRead } = useTrips();
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Mark all as read when opening (optional, we'll keep unread until interaction for now)
  };

  const handleRespond = async (e, notification, action) => {
    e.stopPropagation();
    await respondToInvite(notification, action);
  };

  const handleMarkRead = async (e, notification) => {
    e.stopPropagation();
    await markNotificationRead(notification.id);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        style={{ 
          background: 'var(--color-surface)', border: '1px solid var(--color-border)', 
          width: 40, height: 40, borderRadius: '50%', color: 'var(--color-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          position: 'relative'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute', top: -2, right: -2, background: 'var(--color-danger)',
            color: 'white', fontSize: 10, fontWeight: 'bold', width: 18, height: 18,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unreadCount}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="initial"
            style={{
              position: 'absolute', top: 50, right: 0, width: 320,
              background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)',
              zIndex: 100, overflow: 'hidden'
            }}
          >
            <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', margin: 0 }}>Notifications</h3>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{notifications.length} Total</span>
            </div>

            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No new notifications.
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ 
                    padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)',
                    background: !n.is_read ? 'var(--color-bg)' : 'transparent',
                    display: 'flex', gap: 'var(--space-3)'
                  }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
                      background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {n.sender?.avatar_url ? (
                        <img src={n.sender.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Info size={20} style={{ color: 'var(--color-primary)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      {n.type === 'trip_invite' && (
                        <>
                          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                            <span style={{ fontWeight: 600 }}>{n.sender?.name || 'Someone'}</span> invited you to join <span style={{ fontWeight: 600 }}>{n.trips?.name || 'a trip'}</span>.
                          </p>
                          {n.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                              <button onClick={(e) => handleRespond(e, n, 'accepted')} style={{ flex: 1, padding: 'var(--space-1)', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                <Check size={14} /> Accept
                              </button>
                              <button onClick={(e) => handleRespond(e, n, 'declined')} style={{ flex: 1, padding: 'var(--space-1)', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                <X size={14} /> Decline
                              </button>
                            </div>
                          ) : (
                            <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                              Status: {n.status}
                            </div>
                          )}
                        </>
                      )}

                      {n.type === 'invite_declined' && (
                        <>
                          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                            <span style={{ fontWeight: 600 }}>{n.sender?.name || 'Someone'}</span> declined your invite to <span style={{ fontWeight: 600 }}>{n.trips?.name || 'a trip'}</span>.
                          </p>
                          {!n.is_read && (
                            <button onClick={(e) => handleMarkRead(e, n)} style={{ marginTop: 'var(--space-2)', padding: '4px 8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                              Mark as read
                            </button>
                          )}
                        </>
                      )}

                      {n.type === 'trip_removed' && (
                        <>
                          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                            <span style={{ fontWeight: 600 }}>{n.sender?.name || 'An admin'}</span> removed you from <span style={{ fontWeight: 600 }}>{n.trips?.name || 'a trip'}</span>.
                          </p>
                          {!n.is_read && (
                            <button onClick={(e) => handleMarkRead(e, n)} style={{ marginTop: 'var(--space-2)', padding: '4px 8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                              Mark as read
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
