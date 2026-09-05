import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { Plane, Train, Bus, MapPin, Calendar, Hash, Plus, X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { staggerContainer, fadeInUp } from '../../animations/presets';

const typeOptions = [
  { value: 'flight', label: 'Flight', icon: Plane },
  { value: 'train', label: 'Train', icon: Train },
  { value: 'bus', label: 'Bus / Car', icon: Bus },
];

export default function Transport() {
  const { trip } = useOutletContext();
  const { refreshTrips } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: 'flight', departure_location: '', arrival_location: '', departure_time: '', arrival_time: '', booking_reference: '' });

  if (!trip) return null;

  const transports = trip.transports || [];

  const handleAdd = async () => {
    if (!form.departure_location || !form.arrival_location) { alert('Departure and Arrival locations are required'); return; }
    setSaving(true);
    const { error } = await supabase.from('transports').insert({
      trip_id: trip.id,
      type: form.type,
      departure_location: form.departure_location,
      arrival_location: form.arrival_location,
      departure_time: form.departure_time || null,
      arrival_time: form.arrival_time || null,
      booking_reference: form.booking_reference || null,
      created_by: user.id
    });
    
    if (error) {
      console.error(error);
      alert('Failed to add transport');
    } else {
      setIsAdding(false);
      setForm({ type: 'flight', departure_location: '', arrival_location: '', departure_time: '', arrival_time: '', booking_reference: '' });
      await refreshTrips();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transport?")) return;
    const { error } = await supabase.from('transports').delete().eq('id', id);
    if (!error) refreshTrips();
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d);
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Transportation
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
            Flights, trains, and buses
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {!isAdding && (
            <AnimatedButton onClick={() => setIsAdding(true)}>
              <Plus size={18} style={{ marginRight: 8 }} />
              Add Transport
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
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>New Transport</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                
                <AnimatedDropdown 
                  label="Type" 
                  options={typeOptions} 
                  value={form.type} 
                  onChange={v => setForm({...form, type: v})} 
                  icon={typeOptions.find(t => t.value === form.type)?.icon} 
                />

                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}><AnimatedInput label="From" value={form.departure_location} onChange={v => setForm({...form, departure_location: v})} icon={<MapPin size={18} />} placeholder="Origin" /></div>
                  <div style={{ flex: 1 }}><AnimatedInput label="To" value={form.arrival_location} onChange={v => setForm({...form, arrival_location: v})} icon={<MapPin size={18} />} placeholder="Destination" /></div>
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}><AnimatedInput label="Departure" type="datetime-local" value={form.departure_time} onChange={v => setForm({...form, departure_time: v})} /></div>
                  <div style={{ flex: 1 }}><AnimatedInput label="Arrival" type="datetime-local" value={form.arrival_time} onChange={v => setForm({...form, arrival_time: v})} /></div>
                </div>
                
                <AnimatedInput label="Booking Ref / PNR" value={form.booking_reference} onChange={v => setForm({...form, booking_reference: v})} icon={<Hash size={18} />} placeholder="e.g. ABC123" />
                <AnimatedButton variant="primary" onClick={handleAdd} loading={saving}>Save Transport</AnimatedButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {transports.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          <Plane size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
          <p>No transport added yet.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          {transports.map(transport => {
            const Icon = transport.type === 'flight' ? Plane : transport.type === 'train' ? Train : Bus;
            return (
              <motion.div
                key={transport.id}
                variants={fadeInUp}
                style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {transport.type} {transport.booking_reference && `• REF: ${transport.booking_reference}`}
                      </div>
                      <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)', color: 'var(--color-text)' }}>
                        {transport.departure_location} → {transport.arrival_location}
                      </h3>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', paddingLeft: 52 }}>
                    {transport.departure_time && (
                      <div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>Departs</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                          <Calendar size={14} /> {formatDateTime(transport.departure_time)}
                        </div>
                      </div>
                    )}
                    {transport.arrival_time && (
                      <div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>Arrives</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                          <Calendar size={14} /> {formatDateTime(transport.arrival_time)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {transport.created_by === user?.id && (
                  <div>
                    <button onClick={() => handleDelete(transport.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', opacity: 0.7 }}><Trash2 size={16} /></button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}