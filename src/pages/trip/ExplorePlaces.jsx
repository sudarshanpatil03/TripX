import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { Compass, MapPin, Plus, X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import LocationAutocomplete from '../../components/LocationAutocomplete';
import { staggerContainer, fadeInUp } from '../../animations/presets';

export default function ExplorePlaces() {
  const { trip } = useOutletContext();
  const { refreshTrips, addItineraryActivity } = useTrips();
  const { user } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', image_url: '' });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSpots = async () => {
      if (!trip?.destination) return;
      
      const destName = trip.destination.split(',')[0].trim(); // Extract first part (e.g. 'Goa' from 'Goa, India')
      
      const { data, error } = await supabase
        .from('global_spots')
        .select('*')
        .ilike('destination', `%${destName}%`);
        
      if (!error && data) {
        setSuggestions(data);
      }
    };
    fetchSpots();
  }, [trip?.destination]);

  if (!trip) return null;

  const places = trip.places || [];

  const handleAdd = async () => {
    if (!form.title) { alert('Title is required'); return; }
    setSaving(true);
    const { error } = await supabase.from('places').insert({
      trip_id: trip.id,
      title: form.title,
      description: form.description,
      location: form.location,
      image_url: form.image_url,
      created_by: user.id
    });
    
    if (error) {
      console.error(error);
      alert('Failed to add place');
    } else {
      // Auto-add to the itinerary
      try {
        await addItineraryActivity(trip.id, {
          title: form.title,
          date: trip.start_date || new Date().toISOString().split('T')[0],
          startTime: '10:00', // Default time
          location: form.location,
          notes: form.description
        });
      } catch (err) {
        console.error("Failed to auto-add to itinerary", err);
      }
      
      setIsAdding(false);
      setForm({ title: '', description: '', location: '', image_url: '' });
      await refreshTrips();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this place?")) return;
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (!error) refreshTrips();
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Explore Places
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
            Discover and save spots in {trip.destination}
          </p>
        </div>
        {!isAdding && (
          <AnimatedButton onClick={() => setIsAdding(true)}>
            <Plus size={18} style={{ marginRight: 8 }} />
            Add Place
          </AnimatedButton>
        )}
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
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>New Place</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <AnimatedInput label="Title" value={form.title} onChange={v => setForm({...form, title: v})} placeholder="e.g. Louvre Museum" autoFocus />
                <LocationAutocomplete label="Location" value={form.location} onChange={v => setForm({...form, location: v})} placeholder="Address or neighborhood" />
                <AnimatedInput label="Image URL" value={form.image_url} onChange={v => setForm({...form, image_url: v})} placeholder="https://..." />
                <AnimatedInput label="Description" multiline value={form.description} onChange={v => setForm({...form, description: v})} placeholder="Why visit?" />
                <AnimatedButton variant="primary" onClick={handleAdd} loading={saving}>Save Place</AnimatedButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAdding && suggestions.length > 0 && (
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Popular in {trip.destination}</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', paddingBottom: 'var(--space-2)', scrollSnapType: 'x mandatory' }}>
            {suggestions.map((spot, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ 
                  minWidth: 260, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--color-border)', overflow: 'hidden', scrollSnapAlign: 'start',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ height: 120, background: 'var(--color-border)' }}>
                  <img src={spot.image_url} alt={spot.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 'var(--space-3)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>{spot.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-2)' }}>
                    <MapPin size={12} /> {spot.location}
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', flex: 1 }}>{spot.description}</p>
                  <AnimatedButton 
                    variant="secondary" 
                    style={{ marginTop: 'var(--space-2)', padding: '6px 12px', fontSize: 'var(--font-size-xs)' }}
                    onClick={() => {
                      setForm({ title: spot.title, location: spot.location, description: spot.description, image_url: spot.image_url });
                      setIsAdding(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Plus size={14} style={{ marginRight: 4 }} /> Add to Trip
                  </AnimatedButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {places.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          <Compass size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
          <p>No places added yet. Build your bucket list!</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4)' }}
        >
          {places.map(place => (
            <motion.div
              key={place.id}
              variants={fadeInUp}
              style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}
            >
              {place.image_url ? (
                <div style={{ height: 140, background: 'var(--color-border)', overflow: 'hidden' }}>
                  <img src={place.image_url} alt={place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: 100, background: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Compass size={32} />
                </div>
              )}
              <div style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-1)', display: 'flex', justifyContent: 'space-between' }}>
                  {place.title}
                  {place.created_by === user?.id && (
                    <button onClick={() => handleDelete(place.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 0 }}><Trash2 size={14} /></button>
                  )}
                </h3>
                {place.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-2)' }}>
                    <MapPin size={12} /> {place.location}
                  </div>
                )}
                {place.description && (
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {place.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}