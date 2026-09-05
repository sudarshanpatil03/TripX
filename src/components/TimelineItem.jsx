import { motion } from 'motion/react';
import { fadeInUp, springs } from '../animations/presets';
import * as Icons from 'lucide-react';

const typeColors = {
  transport: '#3B82F6',
  stay: '#7C3AED',
  place: '#10B981',
  food: '#F59E0B',
  activity: '#EC4899',
};

export default function TimelineItem({ activity, index = 0, isLast = false }) {
  const IconComponent = Icons[activity.icon] || Icons.Circle;
  const dotColor = typeColors[activity.type] || 'var(--color-primary)';

  return (
    <motion.div
      variants={fadeInUp}
      style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative' }}
    >
      {/* Timeline line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 32 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, ...springs.bouncy }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-full)',
            background: dotColor + '15',
            border: `2px solid ${dotColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: dotColor,
            flexShrink: 0,
          }}
        >
          <IconComponent size={14} />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            style={{
              width: 2,
              flex: 1,
              background: 'var(--color-border)',
              transformOrigin: 'top',
              minHeight: 20,
            }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.1 }}
        style={{ flex: 1, paddingBottom: isLast ? 0 : 'var(--space-5)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: dotColor, fontWeight: 600 }}>
              {activity.time}
            </span>
            <h4 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', marginTop: 2 }}>
              {activity.title}
            </h4>
            {activity.note && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {activity.note}
              </p>
            )}
            {activity.duration && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {activity.duration}
              </span>
            )}
          </div>
          {activity.cost > 0 && (
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
              ₹{activity.cost.toLocaleString()}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
