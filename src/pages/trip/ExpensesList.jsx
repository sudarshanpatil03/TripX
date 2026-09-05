import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { Plus, Hotel, UtensilsCrossed, Car, Ticket, ShoppingBag, MoreHorizontal, Receipt } from 'lucide-react';
import { springs, staggerContainer, fadeInUp } from '../../animations/presets';
import { formatDateShort } from '../../data/mockData';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'hotel': return Hotel;
    case 'food': return UtensilsCrossed;
    case 'transport': return Car;
    case 'tickets': return Ticket;
    case 'shopping': return ShoppingBag;
    default: return MoreHorizontal;
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'hotel': return 'var(--color-info)';
    case 'food': return 'var(--color-warning)';
    case 'transport': return 'var(--color-primary)';
    case 'tickets': return 'var(--color-danger)';
    case 'shopping': return 'var(--color-success)';
    default: return 'var(--color-text-muted)';
  }
};

export default function ExpensesList() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();

  const expenses = trip?.expenses || [];
  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Group by date
  const grouped = expenses.reduce((acc, exp) => {
    const date = exp.expense_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(exp);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)' }}>
      {/* Overview Card */}
      <motion.div
        className="card card--glass"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-6)', textAlign: 'center', padding: 'var(--space-6)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }}>
            <Receipt size={32} />
          </div>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total Trip Expenses</p>
        <h2 style={{ fontSize: 'var(--font-size-3xl)', fontFamily: 'var(--font-display)', fontWeight: 800, marginTop: 'var(--space-1)' }}>
          ₹{totalExpense}
        </h2>
        
        {/* Balances summary preview - simplified for MVP */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <button onClick={() => navigate('balances')} style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>View Balances & Settlements</button>
        </div>
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>All Expenses</h3>
      </div>

      {expenses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--color-text-muted)' }}>
          <Receipt size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
          <p>No expenses added yet.</p>
          <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>Tap the + button to record a payment.</p>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          {sortedDates.map((date) => (
            <div key={date} style={{ marginBottom: 'var(--space-5)' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {formatDateShort(date)}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {grouped[date].map((exp) => {
                  const Icon = getCategoryIcon(exp.category);
                  const color = getCategoryColor(exp.category);
                  
                  // Find who paid
                  const payer = trip.trip_members?.find(m => m.user_id === exp.paid_by);
                  const payerName = payer?.users?.name || 'Someone';

                  return (
                    <motion.div
                      key={exp.id}
                      variants={fadeInUp}
                      className="card card--interactive"
                      style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: `${color}22`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.name}</h4>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>Paid by {payerName}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', fontFamily: 'var(--font-display)' }}>₹{exp.amount}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.button
        onClick={() => navigate('add')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: 'calc(var(--nav-height) + var(--space-6))',
          right: 'var(--space-6)',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
}