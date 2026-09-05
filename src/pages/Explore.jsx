import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plus } from 'lucide-react';
import LocationAutocomplete from '../components/LocationAutocomplete';
import AnimatedButton from '../components/AnimatedButton';
import ThemeToggle from '../components/ThemeToggle';
import { supabase } from '../services/supabaseClient';
import { fadeInUp, staggerContainer, springs } from '../animations/presets';


export default function Explore() {
  const navigate = useNavigate();
  const [exploreLocation, setExploreLocation] = useState('');
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDests = async () => {
      const { data, error } = await supabase
        .from('global_destinations')
        .select('*')
        .order('popularity_score', { ascending: false });
      
      if (!error && data) {
        setPopularDestinations(data);
      }
      setLoading(false);
    };
    fetchDests();
  }, []);

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: 'calc(var(--nav-height) + var(--space-6))' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
          Explore
        </h1>
        <ThemeToggle />
      </header>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Where to next?</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Search for a destination to start planning your next adventure.</p>
          
          <LocationAutocomplete 
            placeholder="Search for a city or country..." 
            value={exploreLocation}
            onChange={setExploreLocation}
            prefix={<MapPin size={18} color="var(--color-primary)" />}
          />
          
          <AnimatePresence>
            {exploreLocation && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 'var(--space-4)' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-primary-bg)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Destination</div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--color-text)' }}>{exploreLocation}</div>
                  </div>
                  <AnimatedButton variant="primary" fullWidth onClick={() => navigate(`/create-trip?destination=${encodeURIComponent(exploreLocation)}`)}>
                    <Plus size={18} style={{ marginRight: 8 }} /> Create Trip Here
                  </AnimatedButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Popular Places */}
        <motion.div variants={fadeInUp} style={{ marginTop: 'var(--space-8)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Popular Destinations</h3>
          {loading ? (
             <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading destinations...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
               {popularDestinations.map((dest) => (
                 <motion.div 
                   key={dest.id}
                   onClick={() => navigate(`/create-trip?destination=${encodeURIComponent(dest.name)}`)}
                   whileHover={{ scale: 1.05, y: -5 }}
                   whileTap={{ scale: 0.95 }}
                   transition={springs.gentle}
                   style={{ 
                     cursor: 'pointer',
                     background: 'var(--color-surface)', 
                     border: '1px solid var(--color-border)', 
                     borderRadius: 'var(--radius-lg)', 
                     overflow: 'hidden',
                     boxShadow: 'var(--shadow-sm)'
                   }}
                 >
                   <div style={{ height: 120, background: 'var(--color-border)' }}>
                      <img src={dest.image_url} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                   <div style={{ padding: 'var(--space-3)' }}>
                     <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{dest.name}</h4>
                   </div>
                 </motion.div>
               ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
