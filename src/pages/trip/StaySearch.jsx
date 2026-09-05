import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Tag, Star, Home } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { springs, staggerContainer, fadeInUp } from '../../animations/presets';
import AnimatedButton from '../../components/AnimatedButton';

export default function StaySearch() {
  const { trip } = useOutletContext();
  const [location, setLocation] = useState(trip?.destination || 'Goa');
  
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);

  // Fetch hotels from the real database
  const searchHotels = async () => {
    if (!location) return;
    setLoading(true);
    try {
      // In a real app, this would use text search. For demo, we do ilike or simple filter.
      const { data, error } = await supabase
        .from('global_hotels')
        .select('*')
        .ilike('location', `%${location}%`)
        .order('price_per_night', { ascending: true }); // Lowest price first
        
      if (error) throw error;
      setHotels(data || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run search on mount
  useEffect(() => {
    searchHotels();
  }, []);

  const handleBook = (hotel) => {
    window.open(hotel.booking_url, '_blank', 'noopener,noreferrer');
  };

  // The first hotel is the cheapest because we ordered by price ASC in Supabase
  const cheapestHotelId = hotels.length > 0 ? hotels[0].id : null;

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: '120px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Book Accommodation
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
          Find the best places to stay in {trip?.name || 'your destination'}.
        </p>
      </div>

      {/* Search Form */}
      <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>DESTINATION</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
            <MapPin size={16} style={{ color: 'var(--color-primary)', marginRight: '8px' }} />
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Goa, Udaipur" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--color-text)' }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <AnimatedButton onClick={searchHotels} style={{ height: '40px' }}>
            <Search size={18} style={{ marginRight: 8 }} />
            Search
          </AnimatedButton>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Available Stays</h2>
        {hotels.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '12px', fontWeight: 600, background: 'var(--color-success-bg)', padding: '4px 8px', borderRadius: '12px' }}>
            <Tag size={12} /> Best deals highlighted
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          Searching live database...
        </div>
      ) : hotels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No hotels found for {location}.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <AnimatePresence>
            {hotels.map((hotel) => {
              const isCheapest = hotel.id === cheapestHotelId;
              
              return (
                <motion.div
                  key={hotel.id}
                  variants={fadeInUp}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${isCheapest ? 'var(--color-success)' : 'var(--color-border)'}`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {isCheapest && (
                    <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10, background: 'var(--color-success)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '6px 16px', borderBottomLeftRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                      CHEAPEST
                    </div>
                  )}
                  
                  {/* Hotel Image */}
                  <div style={{ height: 160, width: '100%', background: 'var(--color-bg)', position: 'relative' }}>
                    {hotel.image_url ? (
                      <img src={hotel.image_url} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                        <Home size={32} opacity={0.3} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>
                      <Star size={12} style={{ color: '#FFD700', fill: '#FFD700' }} />
                      {hotel.rating}
                    </div>
                  </div>
                  
                  <div style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--color-text)', margin: 0 }}>
                          {hotel.name}
                        </h3>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <MapPin size={12} /> {hotel.location}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)', color: isCheapest ? 'var(--color-success)' : 'var(--color-primary)' }}>
                          ₹{hotel.price_per_night}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>per night</div>
                      </div>
                    </div>

                    <AnimatedButton 
                      onClick={() => handleBook(hotel)} 
                      style={{ width: '100%', justifyContent: 'center', background: isCheapest ? 'var(--color-success)' : 'var(--color-primary)', marginTop: 'var(--space-4)' }}
                    >
                      Book on {hotel.provider}
                    </AnimatedButton>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
