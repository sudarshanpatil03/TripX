import React from 'react';

const CATEGORY_COLORS = {
  'Food': '#FF6B6B',
  'Transport': '#4ECDC4',
  'Accommodation': '#45B7D1',
  'Activities': '#F9CA24',
  'Other': '#A55EEA'
};

export default function DoughnutChart({ data, size = 150, strokeWidth = 20 }) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-hover)', borderRadius: '50%' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>No Expenses</span>
      </div>
    );
  }

  let cumulativePercent = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Object.entries(data).map(([category, value]) => {
          if (value === 0) return null;
          
          const percent = value / total;
          const strokeDasharray = `${percent * circumference} ${circumference}`;
          const strokeDashoffset = -(cumulativePercent * circumference);
          
          cumulativePercent += percent;
          
          return (
            <circle
              key={category}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={CATEGORY_COLORS[category] || CATEGORY_COLORS['Other']}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease-out, stroke-dashoffset 0.5s ease-out', transformOrigin: 'center', transform: 'rotate(-90deg)' }}
            />
          );
        })}
      </svg>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
        {Object.entries(data).map(([category, value]) => {
          if (value === 0) return null;
          return (
            <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-xs)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'] }} />
              <span style={{ color: 'var(--color-text-secondary)' }}>{category}</span>
              <span style={{ fontWeight: 600 }}>₹{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
