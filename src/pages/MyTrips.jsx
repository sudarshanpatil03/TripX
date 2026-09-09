import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, User, Sparkles, Plane, CalendarCheck, Clock3, CheckCircle2, TrendingUp } from 'lucide-react';
import FilterTabs from '../components/FilterTabs';
import TripCard from '../components/TripCard';
import NotificationsDropdown from '../components/NotificationsDropdown';
import { fadeInUp, staggerContainer, springs } from '../animations/presets';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
];

export default function MyTrips() {
  const navigate = useNavigate();
  const { trips, loading } = useTrips();
  const { user, profile } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    const upcoming = trips.filter(t=>t.status==='upcoming').length;
    const ongoing = trips.filter(t=>t.status==='ongoing').length;
    const completed = trips.filter(t=>t.status==='completed').length;
    const totalSpent = trips.reduce((a,t)=>a+(t.total_expense||0),0);
    return { total: trips.length, upcoming, ongoing, completed, totalSpent };
  }, [trips]);

  const filteredTrips = trips.filter((t) => {
    const matchFilter = activeFilter === 'all' || t.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.name?.toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const displayName = profile?.name || user?.user_metadata?.full_name?.split(' ')[0] || 'Traveler';

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: 'calc(var(--nav-height) + var(--space-6))' }}>
      {/* Premium Header with gradient orb */}
      <motion.header initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap:'wrap', gap:'var(--space-3)', marginBottom: 'var(--space-5)', position:'relative' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 800, background:'var(--gradient-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            TripX
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display:'flex', alignItems:'center', gap:6 }}>
            <Sparkles size={14} color="var(--color-primary)" /> Welcome back, {displayName} • {stats.total} trips
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <NotificationsDropdown />
          <motion.button whileTap={{ scale:0.92 }} onClick={() => navigate('/profile')} style={{ background: 'var(--color-primary-bg)', border: '2px solid var(--color-surface)', width: 44, height: 44, borderRadius: '50%', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} />}
          </motion.button>
        </div>
      </motion.header>

      {/* Spotlight Search — NEW FEATURE */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="spotlight-search" style={{ marginBottom:'var(--space-4)' }}>
        <Search size={18} color="var(--color-text-muted)" />
        <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search trips, destinations..." style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:'var(--font-size-base)' }} />
        {searchQuery && <button onClick={()=>setSearchQuery('')} style={{ fontSize:'var(--font-size-xs)', color:'var(--color-primary)', fontWeight:600 }}>Clear</button>}
      </motion.div>

      {/* Bento Stats — NEW FEATURE */}
      <div className="bento-grid" style={{ marginBottom:'var(--space-5)' }}>
        <motion.div whileHover={{ y:-3 }} className="stat-bento glow-hover" style={{ cursor:'pointer' }} onClick={()=>setActiveFilter('ongoing')}><div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--color-primary)', marginBottom:6 }}><Clock3 size={16} /> <span style={{ fontSize:'var(--font-size-xs)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Ongoing</span></div><div style={{ fontSize:'1.6rem', fontWeight:800, fontFamily:'var(--font-display)' }}>{stats.ongoing}</div><div style={{ fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)' }}>{stats.upcoming} upcoming</div></motion.div>
        <motion.div whileHover={{ y:-3 }} className="stat-bento glow-hover"><div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--color-success)', marginBottom:6 }}><CheckCircle2 size={16} /> <span style={{ fontSize:'var(--font-size-xs)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Completed</span></div><div style={{ fontSize:'1.6rem', fontWeight:800 }}>{stats.completed}</div><div style={{ fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)' }}>{stats.total} total trips</div></motion.div>
        <motion.div whileHover={{ y:-3 }} className="stat-bento glow-hover" style={{ gridColumn:'span 2' }}><div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--color-warning)', marginBottom:6 }}><TrendingUp size={16} /> <span style={{ fontSize:'var(--font-size-xs)', fontWeight:700 }}>Total Spend • Spotlight</span></div><div style={{ fontSize:'1.4rem', fontWeight:800 }}>₹{stats.totalSpent.toLocaleString('en-IN')}</div><div style={{ height:6, background:'var(--color-border)', borderRadius:999, marginTop:8, overflow:'hidden' }}><motion.div initial={{ width:0 }} animate={{ width: stats.ongoing ? '68%' : '35%' }} transition={{ duration:0.9, delay:0.3 }} style={{ height:'100%', background:'var(--gradient-primary)' }} /></div></motion.div>
      </div>

      <div style={{ marginBottom: 'var(--space-5)' }}>
        <FilterTabs tabs={filterOptions} activeTab={activeFilter} onChange={setActiveFilter} />
      </div>

      <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} onClick={() => navigate('/create-trip')} className="fab-pulse" style={{ width: '100%', padding: 'var(--space-4)', background: 'var(--gradient-primary)', border: 'none', borderRadius: 'var(--radius-xl)', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', cursor: 'pointer', boxShadow:'var(--shadow-glow-primary)', fontSize:'var(--font-size-base)' }}>
        <span style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={16} /></span>
        Plan a New Trip — get inspired <Plane size={16} style={{ marginLeft:4 }} />
      </motion.button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          Loading trips...
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="responsive-trips-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredTrips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}
              >
                No trips found. Time to plan one!
              </motion.div>
            ) : (
              filteredTrips.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}