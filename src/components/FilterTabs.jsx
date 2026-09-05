import { motion } from 'motion/react';
import { springs } from '../animations/presets';

export default function FilterTabs({ tabs, activeTab, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-1)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-1)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{
            flex: 1,
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            position: 'relative',
            zIndex: 1,
            color: activeTab === tab.value ? 'white' : 'var(--color-text-secondary)',
            background: 'transparent',
            cursor: 'pointer',
            border: 'none',
            whiteSpace: 'nowrap',
          }}
          whileTap={{ scale: 0.95 }}
        >
          {activeTab === tab.value && (
            <motion.div
              layoutId="filter-active"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                zIndex: -1,
                boxShadow: 'var(--shadow-glow-primary)',
              }}
              transition={springs.bouncy}
            />
          )}
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}
