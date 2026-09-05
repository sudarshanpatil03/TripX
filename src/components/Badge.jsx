import { motion } from 'motion/react';
import { springs } from '../animations/presets';

const badgeStyles = {
  owner: 'badge--owner',
  admin: 'badge--admin',
  member: 'badge--member',
  pending: 'badge--pending',
};

export default function Badge({ type = 'member', children }) {
  return (
    <motion.span
      className={`badge ${badgeStyles[type] || 'badge--member'}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springs.bouncy}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.span>
  );
}
