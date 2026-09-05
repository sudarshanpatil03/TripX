import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { getUserById, formatCurrency, formatDateShort, expenseCategories } from '../data/mockData';
import { fadeInRight, springs } from '../animations/presets';
import * as Icons from 'lucide-react';

export default function ExpenseItem({ expense, tripId, index = 0 }) {
  const navigate = useNavigate();
  const paidByUser = getUserById(expense.paidBy);
  const category = expenseCategories.find((c) => c.value === expense.category);
  const CategoryIcon = Icons[category?.icon] || Icons.Receipt;

  return (
    <motion.div
      variants={fadeInRight}
      whileHover={{ x: 4, backgroundColor: 'var(--color-surface-hover)' }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate(`/trip/${tripId}/expenses/${expense.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        borderBottom: '1px solid var(--color-border)',
        transition: 'background var(--transition-fast)',
      }}
    >
      {/* Category icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: (category?.color || '#7C3AED') + '15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: category?.color || 'var(--color-primary)',
          flexShrink: 0,
        }}
      >
        <CategoryIcon size={20} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>{expense.name}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: 8, marginTop: 2 }}>
          <span>{paidByUser.name} • {formatDateShort(expense.date)}</span>
          <span>For: {expense.forWhom.length === 1 ? '1 Member' : `All ${expense.forWhom.length} Members`}</span>
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)' }}>
          {formatCurrency(expense.amount)}
        </div>
      </div>

      <ChevronRight size={16} color="var(--color-text-muted)" />
    </motion.div>
  );
}
