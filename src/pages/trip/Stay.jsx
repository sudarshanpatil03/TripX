import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { Home, MapPin, Calendar, Hash, Plus, X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import { staggerContainer, fadeInUp } from '../../animations/presets';

export default function Stay() {
  const { trip } = useOutletContext();
  const { refreshTrips } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', check_in_date: '', check_out_date: '', booking_reference: '', notes: '' });

  if (!trip) return null;

  const stays = trip.stays || [];

  const handleAdd = async () => {
    if (!form.name) { alert('Name is required'); return; }
    setSaving(true);
    const { error } = await supabase.from('stays').insert({
      trip_id: trip.id,
      name: form.name,
      address: form.address || null,
      check_in_date: form.check_in_date || null,
      check_out_date: form.check_out_date || null,
      booking_reference: form.booking_reference || null,
      notes: form.notes || null,
      created_by: user.id
    });
    
    if (error) {
      console.error(error);
      alert('Failed to add stay');
    } else {
      setIsAdding(false);
      setForm({ name: '', address: '', check_in_date: '', check_out_date: '', booking_reference: '', notes: '' });
      await refreshTrips();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this accommodation?")) return;
    const { error } = await supabase.from('stays').delete().eq('id', id);
    if (!error) refreshTrips();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Accommodation
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
            Your hotels and stays
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {!isAdding && (
            <AnimatedButton onClick={() => setIsAdding(true)}>
              <Plus size={18} style={{ marginRight: 8 }} />
              Add Stay
            </AnimatedButton>
          )}
          <AnimatedButton variant="primary" onClick={() => navigate('search')} style={{ background: 'var(--color-success)' }}>
            Search & Book
          </AnimatedButton>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 'var(--space-6)' }}
          >
            <div style={{ background: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>New Accommodation</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <AnimatedInput label="Hotel/Airbnb Name" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="e.g. Hilton City Center" autoFocus />
                <AnimatedInput label="Address" value={form.address} onChange={v => setForm({...form, address: v})} icon={<MapPin size={18} />} placeholder="Full address" />
                
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}><AnimatedInput label="Check In" type="date" value={form.check_in_date} onChange={v => setForm({...form, check_in_date: v})} /></div>
                  <div style={{ flex: 1 }}><AnimatedInput label="Check Out" type="date" value={form.check_out_date} onChange={v => setForm({...form, check_out_date: v})} /></div>
                </div>
                
                <AnimatedInput label="Booking Ref / Confirmation #" value={form.booking_reference} onChange={v => setForm({...form, booking_reference: v})} icon={<Hash size={18} />} placeholder="e.g. XYZ123" />
                <AnimatedInput label="Notes" multiline value={form.notes} onChange={v => setForm({...form, notes: v})} placeholder="Any details..." />
                <AnimatedButton variant="primary" onClick={handleAdd} loading={saving}>Save Stay</AnimatedButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stays.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          <Home size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
          <p>No accommodations added yet.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          {stays.map(stay => (
            <motion.div
              key={stay.id}
              variants={fadeInUp}
              style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Home size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)', color: 'var(--color-text)' }}>{stay.name}</h3>
                    {stay.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                        <MapPin size={14} /> {stay.address}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginTop: 'var(--space-4)', paddingLeft: 52 }}>
                  {(stay.check_in_date || stay.check_out_date) && (
                    <div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Dates</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                        <Calendar size={14} />
                        {formatDate(stay.check_in_date)} {stay.check_out_date && ` - ${formatDate(stay.check_out_date)}`}
                      </div>
                    </div>
                  )}
                  {stay.booking_reference && (
                    <div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Booking Ref</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-sm)', fontWeight: 500, fontFamily: 'monospace' }}>
                        <Hash size={14} /> {stay.booking_reference}
                      </div>
                    </div>
                  )}
                </div>
                
                {stay.notes && (
                  <div style={{ marginTop: 'var(--space-4)', paddingLeft: 52, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {stay.notes}
                  </div>
                )}
              </div>
              
              {stay.created_by === user?.id && (
                <div>
                  <button onClick={() => handleDelete(stay.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', opacity: 0.7 }}><Trash2 size={16} /></button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}