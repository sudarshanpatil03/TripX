import { motion } from 'motion/react';
import { springs } from '../animations/presets';

export default function ToggleSwitch({ value, onChange, size = 'md' }) {
  const w = size === 'sm' ? 40 : 48;
  const h = size === 'sm' ? 22 : 26;
  const dot = size === 'sm' ? 16 : 20;

  return (
    <motion.button
      onClick={() => onChange(!value)}
      style={{
        width: w,
        height: h,
        borderRadius: h,
        padding: 3,
        cursor: 'pointer',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
      }}
      animate={{
        background: value ? 'var(--color-primary)' : 'var(--color-border)',
      }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        style={{
          width: dot,
          height: dot,
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
        animate={{ x: value ? w - dot - 6 : 0 }}
        transition={springs.bouncy}
      />
    </motion.button>
  );
}
