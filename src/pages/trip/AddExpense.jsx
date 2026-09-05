import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
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

export default function AddExpense() {
  const navigate = useNavigate();
  const { trip } = useOutletContext();
  const { addExpense } = useTrips();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: 'food',
    paidBy: user?.id || '',
    note: '',
  });

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
    if (!form.name || !form.amount || !form.paidBy) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      setLoading(true);
      await addExpense(trip.id, form, receiptFile);
      navigate(`/trip/${trip.id}/expenses`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Add Expense
        </h1>
      </div>

      {/* Form */}
      <motion.div
        style={{ padding: 'var(--space-4)' }}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeInUp}>
          <AnimatedInput
            label="Expense Name"
            value={form.name}
            onChange={(v) => updateField('name', v)}
            placeholder="e.g. Dinner at Cafe"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <AnimatedInput
            label="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={(v) => updateField('amount', v)}
            placeholder="0"
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
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: receiptFile ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', justifyContent: 'center', background: receiptFile ? 'var(--color-primary-bg)' : 'transparent', borderColor: receiptFile ? 'var(--color-primary)' : 'var(--color-border)' }}
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
                {receiptFile ? receiptFile.name : 'Add Receipt Photo'}
              </span>
            </motion.div>
          </label>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={fadeInUp} style={{ paddingBottom: 'var(--space-6)' }}>
          <AnimatedButton
            variant="primary"
            onClick={handleSave}
            loading={loading}
          >
            Save Expense
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
