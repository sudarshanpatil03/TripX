import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import { springs, fadeInUp } from '../../animations/presets';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { error } = await signInWithFacebook();
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Facebook.');
    }
  };

  const handleAppleLogin = async () => {
    setError('Apple login is in progress. Please login through Facebook or Google for now.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'var(--color-bg)',
      position: 'relative',
      overflow: 'hidden',
      perspective: '1000px'
    }}>
      
      {/* Massive 3D Rotating Background Logo */}
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '150vh',
          height: '150vh',
          opacity: 0.05,
          zIndex: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </motion.div>
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-10%', right: '-10%', width: 300, height: 300,
          background: 'radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%)',
          filter: 'blur(40px)', zIndex: 0
        }}
      />

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        style={{
          background: 'var(--color-surface)',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: 400,
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1,
          border: '1px solid var(--color-border)',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)', perspective: '800px' }}>
          
          {/* 3D Rotating Foreground Logo */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 90,
              height: 90,
              margin: '0 auto var(--space-4)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              background: 'white'
            }}
          >
            <img src="/logo.png" alt="TripX Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            TripX
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>Welcome back! Ready for your next trip?</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <AnimatedInput prefix={<Mail size={18} />} type="email" placeholder="Email Address" value={email} onChange={setEmail} required />
          <AnimatedInput prefix={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={setPassword} required />

          <AnimatedButton type="submit" fullWidth disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </AnimatedButton>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-6) 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ padding: '0 var(--space-3)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <AnimatedButton variant="outline" fullWidth onClick={handleGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18, marginRight: 8 }} />
            Continue with Google
          </AnimatedButton>
          <AnimatedButton variant="outline" fullWidth onClick={handleAppleLogin}>
            🍎 Sign in with Apple
          </AnimatedButton>
          <AnimatedButton variant="outline" fullWidth onClick={handleFacebookLogin}>
            📘 Sign in with Facebook
          </AnimatedButton>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </motion.div>
    </div>
  );
}
