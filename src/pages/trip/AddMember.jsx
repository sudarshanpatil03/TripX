import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { ArrowLeft, Copy, CheckCircle, Mail, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import { useTrips } from '../../context/TripContext';
import { springs, fadeInUp } from '../../animations/presets';

export default function AddMember() {
  const { trip } = useOutletContext();
  const { sendInviteByEmail } = useTrips();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [error, setError] = useState(null);

  if (!trip) return null;

  const inviteLink = `${window.location.origin}/trip/${trip.id}/join`;
  const shareText = `Hey! Join my trip "${trip.name}" on TripX! \n\n${inviteLink}`;
  const encodedShareText = encodeURIComponent(shareText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleEmailInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError(null);
    try {
      await sendInviteByEmail(trip.id, email);
      setInviteSent(true);
      setEmail('');
      setTimeout(() => setInviteSent(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to send invite.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 600, margin: '0 auto' }}>
      <button 
        onClick={() => navigate('..')}
        style={{ 
          background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', 
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer',
          marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)', fontWeight: 500
        }}
      >
        <ArrowLeft size={16} /> Back to Members
      </button>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        style={{
          background: 'var(--color-surface)',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)'
        }}>
          <span style={{ fontSize: 32 }}>👋</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
          Invite to {trip.name}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Send an invite directly to their email, or share the link below.
        </p>

        {/* Invite by Email */}
        <form onSubmit={handleEmailInvite} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <div style={{ flex: 1 }}>
            <AnimatedInput 
              type="email" 
              placeholder="Enter email address" 
              value={email} 
              onChange={setEmail} 
              required
            />
          </div>
          <AnimatedButton type="submit" disabled={sending} style={{ flexShrink: 0, padding: '0 var(--space-4)' }}>
            {sending ? 'Sending...' : <><Send size={18} style={{ marginRight: 8 }} /> Send</>}
          </AnimatedButton>
        </form>

        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
            {error}
          </div>
        )}
        {inviteSent && (
          <div style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)', fontWeight: 500 }}>
            Invite sent successfully!
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-6) 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ padding: '0 var(--space-3)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>OR SHARE LINK</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <div style={{
            flex: 1,
            background: 'var(--color-bg)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {inviteLink}
          </div>
          <AnimatedButton onClick={handleCopy} style={{ flexShrink: 0 }}>
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          </AnimatedButton>
        </div>

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-6)' }}
          >
            Invite link copied to clipboard!
          </motion.div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <AnimatedButton 
            variant="outline" 
            fullWidth 
            onClick={() => window.open(`https://wa.me/?text=${encodedShareText}`, '_blank')}
            style={{ borderColor: '#25D366', color: '#25D366' }}
          >
            <MessageCircle size={18} style={{ marginRight: 8 }} />
            WhatsApp
          </AnimatedButton>
          
          <AnimatedButton 
            variant="outline" 
            fullWidth 
            onClick={() => window.location.href = `mailto:?subject=Join my trip on TripX&body=${encodedShareText}`}
          >
            <Mail size={18} style={{ marginRight: 8 }} />
            Email
          </AnimatedButton>
        </div>

      </motion.div>
    </div>
  );
}
