import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Wallet } from 'lucide-react';
import AnimatedInput from '../components/AnimatedInput';
import LocationAutocomplete from '../components/LocationAutocomplete';
import AnimatedButton from '../components/AnimatedButton';
import { useTrips } from '../context/TripContext';
import { tripTypes } from '../data/mockData';
import { fadeInUp, springs } from '../animations/presets';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'friends',
    startingLocation: '',
    destination: searchParams.get('destination') || '',
    startDate: '',
    endDate: '',
    estimatedBudget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tripId = await createTrip(formData);
      navigate('/trip-created', { state: { tripId } });
    } catch (err) {
      setError(err.message || "Failed to create trip");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-4)', paddingBottom: 'calc(var(--nav-height) + var(--space-6))' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <button onClick={() => navigate(-1)} className="header__back">
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Create New Trip</h1>
      </header>

      {error && (
        <div style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
          {error}
        </div>
      )}

      <motion.form 
        onSubmit={handleSubmit}
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
      >
        <AnimatedInput 
          label="Trip Name (Optional)" 
          placeholder="e.g. Goa Trip" 
          value={formData.name} 
          onChange={(val) => setFormData({...formData, name: val})} 
        />

        <div className="form-group">
          <label className="form-label">Trip Type</label>
          <select 
            className="form-input" 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            {tripTypes.map(t => (
              <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
            ))}
          </select>
        </div>

        <LocationAutocomplete 
          label="Starting Location" 
          placeholder="Where are you starting?" 
          value={formData.startingLocation} 
          onChange={(val) => setFormData({...formData, startingLocation: val})} 
          required 
        />

        <LocationAutocomplete 
          label="Destination" 
          placeholder="Where are you going?" 
          value={formData.destination} 
          onChange={(val) => setFormData({...formData, destination: val})} 
          required 
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <AnimatedInput 
            label="Start Date" 
            type="date"
            value={formData.startDate} 
            onChange={(val) => setFormData({...formData, startDate: val})} 
            required 
            prefix={<Calendar size={16} />}
          />
          <AnimatedInput 
            label="End Date" 
            type="date"
            value={formData.endDate} 
            onChange={(val) => setFormData({...formData, endDate: val})} 
            required 
            prefix={<Calendar size={16} />}
          />
        </div>

        <AnimatedInput 
          label="Estimated Budget (Optional)" 
          type="number"
          placeholder="₹" 
          value={formData.estimatedBudget} 
          onChange={(val) => setFormData({...formData, estimatedBudget: val})} 
          prefix={<Wallet size={16} />}
        />

        <AnimatedButton type="submit" fullWidth disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
          {loading ? 'Creating Trip & Finding Images...' : 'Create Trip'}
        </AnimatedButton>
      </motion.form>
    </div>
  );
}