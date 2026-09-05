import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext } from 'react-router';
import { Image as ImageIcon, Camera, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import { staggerContainer, fadeInUp, springs } from '../../animations/presets';

export default function TripMemories() {
  const { trip } = useOutletContext();
  const { refreshTrips } = useTrips();
  const { user } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ caption: '' });
  const [photoFile, setPhotoFile] = useState(null);

  if (!trip) return null;

  const memories = trip.trip_memories || [];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleAdd = async () => {
    if (!photoFile) { alert('Please select a photo'); return; }
    setSaving(true);
    
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `memories/${trip.id}/${Date.now()}.${fileExt}`;
      
      // We use 'receipts' bucket since we know it exists from the expenses feature. 
      // In a real production app, we'd create a dedicated 'memories' bucket.
      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, photoFile);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
      
      const { error: dbError } = await supabase.from('trip_memories').insert({
        trip_id: trip.id,
        image_url: publicUrl,
        caption: form.caption || null,
        uploaded_by: user.id
      });
      
      if (dbError) throw dbError;
      
      setIsAdding(false);
      setForm({ caption: '' });
      setPhotoFile(null);
      await refreshTrips();
    } catch (err) {
      console.error(err);
      alert('Failed to upload memory: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this memory?")) return;
    const { error } = await supabase.from('trip_memories').delete().eq('id', id);
    if (!error) refreshTrips();
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 1000, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Memories
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
            Photo gallery of your trip
          </p>
        </div>
        {!isAdding && (
          <AnimatedButton onClick={() => setIsAdding(true)}>
            <Plus size={18} style={{ marginRight: 8 }} />
            Add Photo
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
            <div style={{ background: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', maxWidth: 500, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>New Memory</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                
                <label style={{ display: 'block' }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <motion.div
                    style={{ height: 200, border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: photoFile ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', background: photoFile ? 'var(--color-primary-bg)' : 'transparent', borderColor: photoFile ? 'var(--color-primary)' : 'var(--color-border)' }}
                    whileHover={{ borderColor: 'var(--color-primary)', background: 'var(--color-primary-bg)', scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={springs.gentle}
                  >
                    <Camera size={32} style={{ marginBottom: 'var(--space-2)' }} />
                    <span style={{ fontWeight: 500 }}>
                      {photoFile ? photoFile.name : 'Tap to select photo'}
                    </span>
                  </motion.div>
                </label>
                
                <AnimatedInput label="Caption" value={form.caption} onChange={v => setForm({...form, caption: v})} placeholder="Say something about this photo..." />
                
                <AnimatedButton variant="primary" onClick={handleAdd} loading={saving}>Upload</AnimatedButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {memories.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          <ImageIcon size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
          <p>No memories added yet. Start taking photos!</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: 'var(--space-4)' 
          }}
        >
          {memories.map(memory => (
            <motion.div
              key={memory.id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              style={{ 
                background: 'var(--color-surface)', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                border: '1px solid var(--color-border)', 
                position: 'relative',
                aspectRatio: '1/1',
                group: 'true'
              }}
            >
              <img src={memory.image_url} alt={memory.caption || 'Memory'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: 'var(--space-6) var(--space-3) var(--space-3)', color: 'white' }}>
                {memory.caption && <p style={{ fontSize: 'var(--font-size-sm)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{memory.caption}</p>}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: memory.caption ? 'var(--space-2)' : 0 }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.7 }}>
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(memory.created_at))}
                  </span>
                  
                  {memory.uploaded_by === user?.id && (
                    <button onClick={() => handleDelete(memory.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,100,100,0.8)', cursor: 'pointer', padding: 0 }}><Trash2 size={14} /></button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}