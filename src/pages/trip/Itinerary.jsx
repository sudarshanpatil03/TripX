import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { ArrowLeft, Map, Clock, MapPin, Plus, X, Trash2 } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import { staggerContainer, fadeInUp, springs } from '../../animations/presets';
import { useTrips } from '../../context/TripContext';

export default function Itinerary() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();
  const { addItineraryActivity, deleteItineraryActivity } = useTrips();
  
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    date: trip?.start_date || new Date().toISOString().split('T')[0],
    startTime: '',
    location: '',
    notes: ''
  });

  if (!trip) return null;

  const activities = [...(trip.itinerary_activities || [])].sort((a, b) => {
    if (a.activity_date !== b.activity_date) {
      return new Date(a.activity_date) - new Date(b.activity_date);
    }
    return (a.start_time || '00:00').localeCompare(b.start_time || '00:00');
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.date) {
      alert("Title and Date are required");
      return;
    }
    setSaving(true);
    try {
      await addItineraryActivity(trip.id, form);
      setIsAdding(false);
      setForm({ title: '', date: trip.start_date || '', startTime: '', location: '', notes: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to add activity");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await deleteItineraryActivity(id, trip.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
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
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}><AnimatedInput label="Date" type="date" value={form.date} onChange={v => updateField('date', v)} /></div>
                <div style={{ flex: 1 }}><AnimatedInput label="Time" type="time" value={form.startTime} onChange={v => updateField('startTime', v)} /></div>
              </div>
              <AnimatedInput label="Notes" multiline value={form.notes} onChange={v => updateField('notes', v)} placeholder="Optional details..." />
              
              <AnimatedButton variant="primary" onClick={handleSave} loading={saving}>Save Activity</AnimatedButton>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Timeline */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            <Map size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
            <p>Your itinerary is empty. Start adding activities!</p>
          </div>
        ) : (
          Object.keys(grouped).sort().map((dateStr) => (
            <div key={dateStr} style={{ marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />
                {formatDate(dateStr)}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingLeft: 'var(--space-3)', borderLeft: '2px solid var(--color-border)' }}>
                {grouped[dateStr].map((act) => (
                  <motion.div
                    key={act.id}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.01 }}
                    style={{
                      background: 'var(--color-surface)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ position: 'absolute', left: -21, top: 24, width: 14, height: 2, background: 'var(--color-border)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>{act.title}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                          {act.start_time && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {act.start_time.substring(0, 5)}</div>
                          )}
                          {act.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {act.location}</div>
                          )}
                        </div>
                        {act.notes && (
                          <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{act.notes}</p>
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