import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Search } from 'lucide-react';
import { springs } from '../animations/presets';

export default function LocationAutocomplete({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  prefix = <MapPin size={16} />
}) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const containerRef = useRef(null);

  // Sync incoming value
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (query.length < 3 || query === value) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          const parsed = data.results.map(p => ({
            id: p.id,
            display_name: `${p.name}${p.admin1 ? ', ' + p.admin1 : ''}${p.country ? ', ' + p.country : ''}`
          }));
          setResults(parsed);
          setShowDropdown(true);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.display_name);
    onChange(place.display_name);
    setShowDropdown(false);
  };

  return (
    <div className="form-group" style={{ position: 'relative' }} ref={containerRef}>
      {label && <label className="form-label">{label}</label>}
      <div className="input-with-icon">
        <span className="input-icon">{loading ? <div className="spinner" style={{ width: 16, height: 16, border: '2px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : prefix}</span>
        <input 
          className="form-input" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value); // keep parent state in sync even without selecting
            if (e.target.value.length >= 3) setShowDropdown(true);
          }}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          required={required}
          style={{ paddingLeft: 'var(--space-8)' }}
        />
      </div>

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springs.gentle}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 'var(--space-2)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              zIndex: 50,
              overflow: 'hidden',
              maxHeight: 250,
              overflowY: 'auto'
            }}
          >
            {results.map((place) => (
              <div
                key={place.id}
                onClick={() => handleSelect(place)}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <MapPin size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                  {place.display_name}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
