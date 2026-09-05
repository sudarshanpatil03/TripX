import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTrips } from '../../context/TripContext';
import { motion } from 'motion/react';

export default function JoinTrip() {
  const { tripId } = useParams();
  const { joinTrip } = useTrips();
  const navigate = useNavigate();
  const [status, setStatus] = useState('joining'); // joining, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const doJoin = async () => {
      try {
        await joinTrip(tripId);
        setStatus('success');
        setTimeout(() => {
          navigate(`/trip/${tripId}/overview`);
        }, 1500);
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Failed to join trip.');
      }
    };
    
    if (tripId) {
      doJoin();
    }
  }, [tripId, joinTrip, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'var(--color-bg)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--color-surface)',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: 400,
          width: '100%'
        }}
      >
        {status === 'joining' && (
          <>
            <div style={{ width: 48, height: 48, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto var(--space-4)' }} />
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Joining Trip...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ width: 64, height: 64, background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: 32 }}>
              🎉
            </div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>You're In!</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Redirecting to the trip dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ width: 64, height: 64, background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: 32 }}>
              ❌
            </div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>Oops!</h2>
            <p style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-6)' }}>{errorMsg}</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: 'var(--space-3) var(--space-6)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Go Home
            </button>
          </>
        )}
      </motion.div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
