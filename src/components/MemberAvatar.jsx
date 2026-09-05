import { motion } from 'motion/react';

export default function MemberAvatar({ name, image, size = 44, showRing = false }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const colors = [
    'linear-gradient(135deg, #7C3AED, #A855F7)',
    'linear-gradient(135deg, #3B82F6, #60A5FA)',
    'linear-gradient(135deg, #10B981, #34D399)',
    'linear-gradient(135deg, #F59E0B, #FBBF24)',
    'linear-gradient(135deg, #EF4444, #F87171)',
    'linear-gradient(135deg, #EC4899, #F472B6)',
  ];

  const colorIndex = name
    ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
    : 0;

  return (
    <motion.div
      className={`member-avatar ${showRing ? 'member-avatar--ring' : ''}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {image ? (
        <img src={image} alt={name} />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: colors[colorIndex],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-full)',
            color: 'white',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </div>
      )}
    </motion.div>
  );
}
