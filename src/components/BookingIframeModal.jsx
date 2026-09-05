import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShieldAlert } from 'lucide-react';
import { springs } from '../animations/presets';

export default function BookingIframeModal({ isOpen, onClose, url, providerName }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={springs.bouncy}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--color-bg)',
          zIndex: 9999, // Super high z-index to cover everything
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button onClick={onClose} style={{
              width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              border: 'none',
              color: 'var(--color-text)'
            }}>
              <X size={20} />
            </button>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text)' }}>Booking with {providerName}</h3>
              <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-text-muted)' }}>Secure In-App Browser</p>
            </div>
          </div>
          
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', background: 'var(--color-primary-bg)', color: 'var(--color-primary)',
              borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Open in browser <ExternalLink size={14} />
          </a>
        </div>

        {/* Warning Banner for Iframe Blocking */}
        <div style={{ background: '#FFFBEB', color: '#92400E', padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #FDE68A' }}>
          <ShieldAlert size={14} style={{ flexShrink: 0 }} />
          <span>If the website refuses to connect due to security policies, please use the <strong>Open in browser</strong> button above.</span>
        </div>

        {/* Iframe */}
        <div style={{ flex: 1, background: '#fff', position: 'relative' }}>
          <iframe 
            src={url}
            title={`Booking with ${providerName}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="payment"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
