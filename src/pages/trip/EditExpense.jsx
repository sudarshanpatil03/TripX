import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import {
  ArrowLeft,
  Hotel,
  UtensilsCrossed,
  Car,
  Ticket,
  ShoppingBag,
  MoreHorizontal,
  Camera,
  Users,
  Trash2
} from 'lucide-react';
import AnimatedInput from '../../components/AnimatedInput';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import AnimatedButton from '../../components/AnimatedButton';
import ThemeToggle from '../../components/ThemeToggle';
import { staggerContainer, fadeInUp, springs } from '../../animations/presets';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';

const categoryOptions = [
  { value: 'hotel', label: 'Hotel', icon: Hotel },
  { value: 'food', label: 'Food & Dining', icon: UtensilsCrossed },
  { value: 'transport', label: 'Transport', icon: Car },
  { value: 'tickets', label: 'Tickets & Entry', icon: Ticket },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

export default function EditExpense() {
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const { trip } = useOutletContext();
  const { updateExpense, deleteExpense } = useTrips();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: 'food',
    paidBy: user?.id || '',
    note: '',
    receiptUrl: ''
  });

  useEffect(() => {
    if (trip && expenseId) {
      const expense = trip.expenses?.find(e => e.id === expenseId);
      if (expense) {
        setForm({
          name: expense.name || '',
          amount: expense.amount || '',
          category: expense.category || 'food',
          paidBy: expense.paid_by || '',
          note: expense.note || '',
          receiptUrl: expense.receipt_url || ''
        });
      }
    }
  }, [trip, expenseId]);

  const memberOptions = (trip?.trip_members || []).map(member => ({
    value: member.user_id,
    label: member.users?.name || 'Unknown User'
  }));

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.amount) {
      alert("Please enter a name and amount");
      return;
    }
    
    setLoading(true);
    try {
      await updateExpense(expenseId, { ...form, tripId: trip.id }, receiptFile);
      navigate('..');
    } catch (err) {
      console.error(err);
      alert("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setDeleting(true);
      try {
        await deleteExpense(expenseId);
        navigate('..');
      } catch (err) {
        console.error(err);
        alert("Failed to delete expense");
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: 'calc(var(--space-8) * 2)', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Edit Expense
          </h1>
        
      </div>

      {/* Form */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
      >
        <motion.div variants={fadeInUp}>
          <AnimatedInput
            label="What was this for?"
            value={form.name}
            onChange={(v) => updateField('name', v)}
            placeholder="e.g. Dinner at Luigi's"
            autoFocus
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <AnimatedInput
            label="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={(v) => updateField('amount', v)}
            placeholder="0.00"
            icon={<span style={{ fontWeight: 600 }}>₹</span>}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <AnimatedDropdown
            label="Category"
            options={categoryOptions}
            value={form.category}
            onChange={(v) => updateField('category', v)}
            icon={categoryOptions.find((c) => c.value === form.category)?.icon}
            placeholder="Select category"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <AnimatedDropdown
            label="Paid By"
            options={memberOptions}
            value={form.paidBy}
            onChange={(v) => updateField('paidBy', v)}
            placeholder="Who paid?"
          />
        </motion.div>

        {/* For Whom section */}
        <motion.div variants={fadeInUp} className="form-group">
          <label className="form-label">Split Among</label>
          <motion.div
            className="select-trigger"
            whileHover={{ borderColor: 'var(--color-primary-light)' }}
          >
            <div className="select-trigger__content">
              <Users size={18} color="var(--color-text-muted)" />
              <span>All Members ({memberOptions.length})</span>
            </div>
            <motion.span
              className="split-toggle"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springs.bouncy}
              style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
            >
              Equal Split
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <AnimatedInput
            label="Note (Optional)"
            multiline
            value={form.note}
            onChange={(v) => updateField('note', v)}
            placeholder="Add a note..."
          />
        </motion.div>

        {/* Receipt Upload */}
        <motion.div variants={fadeInUp} style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block' }}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: receiptFile || form.receiptUrl ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', justifyContent: 'center', background: receiptFile || form.receiptUrl ? 'var(--color-primary-bg)' : 'transparent', borderColor: receiptFile || form.receiptUrl ? 'var(--color-primary)' : 'var(--color-border)' }}
              whileHover={{
                borderColor: 'var(--color-primary)',
                background: 'var(--color-primary-bg)',
                scale: 1.01,
              }}
              whileTap={{ scale: 0.99 }}
              transition={springs.gentle}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Camera size={22} />
              </motion.div>
              <span style={{ fontWeight: 500 }}>
                {receiptFile ? receiptFile.name : (form.receiptUrl ? 'Update Receipt Photo' : 'Add Receipt Photo')}
              </span>
            </motion.div>
          </label>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={fadeInUp} style={{ paddingBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
          <AnimatedButton
            variant="outline"
            onClick={handleDelete}
            loading={deleting}
            style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', flexShrink: 0 }}
          >
            <Trash2 size={20} />
          </AnimatedButton>
          <AnimatedButton
            variant="primary"
            onClick={handleSave}
            loading={loading}
          >
            Save Changes
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </div>
  );
}