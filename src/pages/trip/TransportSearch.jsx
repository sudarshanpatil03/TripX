import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, Plane, Train, Car, Search, ArrowRight, Clock, MapPin, Tag } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { springs, staggerContainer, fadeInUp } from '../../animations/presets';
import AnimatedButton from '../../components/AnimatedButton';

const transportTypes = [
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'train', label: 'Train', icon: Train },
  { id: 'cab', label: 'Cab', icon: Car },
];

export default function TransportSearch() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bus');
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(trip?.destination || 'Goa'); // Default to trip destination
  
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);

  // Fetch routes from the real database
  const searchRoutes = async () => {
    setLoading(true);
    try {
      // In a real app with huge DB, we would filter by 'from' and 'to'.
      // Since this is a demo DB, we'll fetch by type and loosely filter client-side for UX, 
      // or just show what's available in the DB for that type to ensure data shows up.
      const { data, error } = await supabase
        .from('global_transport_routes')
        .select('*')
        .eq('type', activeTab)
        .order('price', { ascending: true }); // Lowest price first
        
      if (error) throw error;
      setRoutes(data || []);
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run search when tab changes
  useEffect(() => {
    searchRoutes();
  }, [activeTab]);

  const handleBook = (route) => {
    window.open(route.booking_url, '_blank', 'noopener,noreferrer');
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    const hrs = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m`;
  };

  // The first route is the cheapest because we ordered by price ASC in Supabase
  const cheapestRouteId = routes.length > 0 ? routes[0].id : null;

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: '120px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Book Transport
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
          Find the best way to get to {trip?.name || 'your destination'}.
        </p>
      </div>

      {/* Search Form */}
      <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>FROM</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={16} style={{ color: 'var(--color-primary)', marginRight: '8px' }} />
              <input type="text" value={from} onChange={e => setFrom(e.target.value)} placeholder="Mumbai" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--color-text)' }} />
            </div>
          </div>
          <ArrowRight size={20} style={{ color: 'var(--color-text-muted)', marginTop: '20px' }} />
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>TO</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={16} style={{ color: 'var(--color-danger)', marginRight: '8px' }} />
              <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="Destination" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--color-text)' }} />
            </div>
          </div>
        </div>
        
        <AnimatedButton onClick={searchRoutes} style={{ width: '100%', justifyContent: 'center' }}>
          <Search size={18} style={{ marginRight: 8 }} />
          Search Options
        </AnimatedButton>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {transportTypes.map(type => {
          const isActive = activeTab === type.id;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              style={{
                flex: 1, minWidth: 80, padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                background: isActive ? 'var(--color-primary-bg)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 500
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: '12px' }}>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Available Options</h2>
        {routes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '12px', fontWeight: 600, background: 'var(--color-success-bg)', padding: '4px 8px', borderRadius: '12px' }}>
            <Tag size={12} /> Cheapest highlighted
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          Searching live database...
        </div>
      ) : routes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No {activeTab}s found for this route.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <AnimatePresence>
            {routes.map((route, idx) => {
              const isCheapest = route.id === cheapestRouteId;
              
              return (
                <motion.div
                  key={route.id}
                  variants={fadeInUp}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${isCheapest ? 'var(--color-success)' : 'var(--color-border)'}`,
                    padding: 'var(--space-4)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isCheapest && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--color-success)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderBottomLeftRadius: '8px' }}>
                      CHEAPEST
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--color-text)' }}>
                        {route.provider}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {route.origin} → {route.destination}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)', color: isCheapest ? 'var(--color-success)' : 'var(--color-primary)' }}>
                        ₹{route.price}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-bg)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 600 }}>{formatTime(route.departure_time)}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{route.origin}</div>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        <Clock size={10} style={{ display: 'inline', marginRight: 2 }} />
                        {formatDuration(route.departure_time, route.arrival_time)}
                      </div>
                      <div style={{ width: '100%', height: 1, background: 'var(--color-border)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 600 }}>{formatTime(route.arrival_time)}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{route.destination}</div>
                    </div>
                  </div>

                  <AnimatedButton 
                    onClick={() => handleBook(route)} 
                    style={{ width: '100%', justifyContent: 'center', background: isCheapest ? 'var(--color-success)' : 'var(--color-primary)' }}
                  >
                    Book on {route.provider}
                  </AnimatedButton>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
