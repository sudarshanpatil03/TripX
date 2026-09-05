import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { springs } from '../animations/presets';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Delete', variant = 'danger' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 500,
            padding: 'var(--space-5)',
          }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={springs.bouncy}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              width: '100%',
              maxWidth: 340,
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Warning Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, ...springs.bouncy }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-danger-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
              }}
            >
              <AlertTriangle size={28} color="var(--color-danger)" />
            </motion.div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-xl)',
                fontWeight: 700,
                marginBottom: 'var(--space-2)',
              }}
            >
              {title || 'Delete Expense?'}
            </h3>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                marginBottom: 'var(--space-6)',
                lineHeight: 1.5,
              }}
            >
              {message || 'Are you sure you want to delete this expense? This action cannot be undone.'}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <AnimatedButton variant="outline" fullWidth onClick={onCancel}>
                Cancel
              </AnimatedButton>
              <AnimatedButton variant={variant} fullWidth onClick={onConfirm}>
                {confirmText}
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
