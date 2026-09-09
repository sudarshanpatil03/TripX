import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { Map, Clock, Plus, X, Trash2, DollarSign } from 'lucide-react';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { staggerContainer, fadeInUp } from '../../animations/presets';
import { useTrips } from '../../context/TripContext';

const TYPE_OPTIONS = [
  { value: 'activity', label: 'Activity' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'other', label: 'Other' },
];

export default function Itinerary() {
  const { trip } = useOutletContext();
  const { addItineraryActivity, deleteItineraryActivity } = useTrips();

  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: 'activity',
    date: trip?.start_date || new Date().toISOString().split('T')[0],
    activityTime: '',
    duration: '',
    cost: '',
    note: '',
  });

  if (!trip) return null;

  const activities = [...(trip.itinerary_activities || [])].sort((a, b) => {
    if (a.activity_date !== b.activity_date) {
      return new Date(a.activity_date) - new Date(b.activity_date);
    }
    return (a.activity_time || '00:00').localeCompare(b.activity_time || '00:00');
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.date) {
      alert('Title and Date are required');
      return;
    }
    setSaving(true);
    try {
      await addItineraryActivity(trip.id, trip.start_date, form);
      setIsAdding(false);
      setForm({ title: '', type: 'activity', date: trip.start_date || '', activityTime: '', duration: '', cost: '', note: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add activity');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await deleteItineraryActivity(id, trip.id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(d);
  };

  // Group by date
  const grouped = activities.reduce((acc, act) => {
    if (!acc[act.activity_date]) acc[act.activity_date] = [];
    acc[act.activity_date].push(act);
    return acc;
  }, {});

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Itinerary
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>Plan your days</p>
      </div>

      {/* Add Button */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" style={{ marginBottom: 'var(--space-8)' }}>
        {!isAdding ? (
          <AnimatedButton onClick={() => setIsAdding(true)} fullWidth style={{ display: 'flex', justifyContent: 'center' }}>
            <Plus size={18} style={{ marginRight: 8 }} />
            Add Activity
          </AnimatedButton>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ background: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>New Activity</h3>
              <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <AnimatedInput label="Activity Title" value={form.title} onChange={v => updateField('title', v)} placeholder="e.g. Visit Eiffel Tower" autoFocus />
              <AnimatedDropdown label="Type" options={TYPE_OPTIONS} value={form.type} onChange={v => updateField('type', v)} />
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}><AnimatedInput label="Date" type="date" value={form.date} onChange={v => updateField('date', v)} /></div>
                <div style={{ flex: 1 }}><AnimatedInput label="Time" type="time" value={form.activityTime} onChange={v => updateField('activityTime', v)} /></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}><AnimatedInput label="Duration" value={form.duration} onChange={v => updateField('duration', v)} placeholder="e.g. 2 hours" /></div>
                <div style={{ flex: 1 }}><AnimatedInput label="Cost (₹)" type="number" value={form.cost} onChange={v => updateField('cost', v)} placeholder="Optional" /></div>
              </div>
              <AnimatedInput label="Note" multiline value={form.note} onChange={v => updateField('note', v)} placeholder="Optional details..." />
              <AnimatedButton variant="primary" onClick={handleSave} loading={saving}>Save Activity</AnimatedButton>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Timeline */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            <Map size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
            <p>Your itinerary is empty. Start adding activities!</p>
          </div>
        ) : (
          Object.keys(grouped).sort().map((dateStr) => (
            <div key={dateStr} style={{ marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
                {formatDate(dateStr)}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingLeft: 'var(--space-3)', borderLeft: '2px solid var(--color-border)' }}>
                {grouped[dateStr].map((act) => (
                  <motion.div
                    key={act.id}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.01 }}
                    style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', position: 'relative' }}
                  >
                    <div style={{ position: 'absolute', left: -21, top: 24, width: 14, height: 2, background: 'var(--color-border)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                          {act.icon && <span style={{ fontSize: 16 }}>{act.icon}</span>}
                          <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>{act.title}</h3>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', background: 'var(--color-primary-bg)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{act.type}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                          {act.activity_time && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {act.activity_time.substring(0, 5)}</div>
                          )}
                          {act.duration && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>⏱ {act.duration}</div>
                          )}
                          {act.cost && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={14} /> ₹{act.cost}</div>
                          )}
                        </div>
                        {act.note && (
                          <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{act.note}</p>
                        )}
                      </div>
                      <button onClick={() => handleDelete(act.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', opacity: 0.7 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}