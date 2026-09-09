import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plus, Heart, Compass, Flame, Mountain, Waves, Building2, Search, Sparkles, Bookmark } from 'lucide-react';
import LocationAutocomplete from '../components/LocationAutocomplete';
import AnimatedButton from '../components/AnimatedButton';
import ThemeToggle from '../components/ThemeToggle';
import { supabase } from '../services/supabaseClient';
import { fadeInUp, staggerContainer, springs } from '../animations/presets';

const categories = [
  { label: 'Beach', icon: Waves },
  { label: 'Mountains', icon: Mountain },
  { label: 'Cities', icon: Building2 },
  { label: 'Trending', icon: Flame },
];


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

  const [activeCat, setActiveCat] = useState('Trending');
  const [wishlist, setWishlist] = useState(() => new Set());
  const toggleWishlist = (id) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const filteredDests = useMemo(()=> activeCat==='Trending' ? popularDestinations : popularDestinations.filter(d=> (d.category||'Trending').toLowerCase()===activeCat.toLowerCase()), [popularDestinations, activeCat]);

  return (
    <div className="page-content">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap:'wrap', gap:'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 800, display:'flex', alignItems:'center', gap:8 }}><Compass size={22} color="var(--color-primary)" /> Explore</h1>
          <p style={{ fontSize:'var(--font-size-sm)', color:'var(--color-text-secondary)', display:'flex', alignItems:'center', gap:6 }}><Sparkles size={12} color="var(--color-primary)" /> Discover • Wishlist • Go</p>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero spotlight — responsive */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} style={{ background:'var(--gradient-primary)', borderRadius:'clamp(16px, 4vw, 24px)', padding:'clamp(16px, 4vw, 24px)', color:'white', marginBottom:'var(--space-5)', position:'relative', overflow:'hidden' }}><div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25), transparent 50%)' }} /><div style={{ position:'relative' }}><div style={{ fontSize:'var(--font-size-xs)', opacity:0.9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>Featured Drop</div><div style={{ fontSize:'var(--font-size-xl)', fontWeight:800, fontFamily:'var(--font-display)', marginBottom:4 }}>Your next story starts here</div><div style={{ opacity:0.9, fontSize:'var(--font-size-sm)', marginBottom:'var(--space-3)' }}>Search, save to wishlist, and create a trip in one tap.</div></div></motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', display:'flex', alignItems:'center', gap:8 }}><Search size={18} color="var(--color-primary)" /> Where to next?</h2>
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
        
        {/* Category chips — NEW */}
        <div style={{ display:'flex', gap:8, marginBottom:'var(--space-4)', overflowX:'auto', scrollbarWidth:'none' }}>
          {categories.map(c=> (<button key={c.label} onClick={()=>setActiveCat(c.label)} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:'var(--radius-full)', border: activeCat===c.label ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)', background: activeCat===c.label ? 'var(--color-primary-bg)' : 'var(--color-surface)', color: activeCat===c.label ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight:700, fontSize:'var(--font-size-sm)', whiteSpace:'nowrap' }}><c.icon size={14} /> {c.label}</button>))}
          <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)', marginLeft:8 }}><Bookmark size={12} /> {wishlist.size} saved</span>
        </div>

        {/* Popular Places — UPGRADED to trending scroll + wishlist */}
        <motion.div variants={fadeInUp} style={{ marginTop: 'var(--space-2)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-4)' }}><h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, display:'flex', alignItems:'center', gap:8 }}><Flame size={18} color="#F59E0B" /> Popular Destinations</h3><span style={{ fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)' }}>{filteredDests.length} places</span></div>
          {loading ? (
             <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading destinations...</div>
          ) : (
            <div className="trending-scroll">
               {filteredDests.map((dest) => (
                 <motion.div 
                   key={dest.id}
                   className="trending-card"
                   whileHover={{ y: -6 }}
                   whileTap={{ scale: 0.97 }}
                   style={{ cursor: 'pointer', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', position:'relative' }}
                 >
                   <div onClick={() => navigate(`/create-trip?destination=${encodeURIComponent(dest.name)}`)} style={{ height: 120, background: 'var(--color-border)', position:'relative' }}>
                      <img src={dest.image_url} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)' }} />
                      <div style={{ position:'absolute', bottom:8, left:10, color:'white', fontWeight:800, fontSize:'var(--font-size-sm)', textShadow:'0 1px 6px rgba(0,0,0,0.4)' }}>{dest.name}</div>
                   </div>
                   <div style={{ padding: '10px var(--space-3)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                     <span style={{ fontSize:'var(--font-size-xs)', color:'var(--color-text-secondary)', display:'flex', alignItems:'center', gap:4 }}><MapPin size={12} /> Tap to plan</span>
                     <button onClick={(e)=>{e.stopPropagation(); toggleWishlist(dest.id);}} style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: wishlist.has(dest.id) ? 'var(--color-primary)' : 'var(--color-surface)', border:'1px solid var(--color-border)', color: wishlist.has(dest.id) ? 'white' : 'var(--color-text-muted)' }}><Heart size={14} fill={wishlist.has(dest.id) ? 'white' : 'none'} /></button>
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
