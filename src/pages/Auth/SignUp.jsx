import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import AnimatedButton from '../../components/AnimatedButton';
import AnimatedInput from '../../components/AnimatedInput';
import { springs, fadeInUp } from '../../animations/presets';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { error } = await signInWithFacebook();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Facebook.');
    }
  };

  const handleAppleLogin = async () => {
    setError('Apple login is in progress. Please sign up through Facebook or Google for now.');
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
      overflow: 'hidden'
    }}>
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
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: 250, height: 250,
          background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
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
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            Join TripX
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>Create an account to start planning.</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <AnimatedInput prefix={<User size={18} />} type="text" placeholder="Full Name" value={fullName} onChange={setFullName} required />
          <AnimatedInput prefix={<Mail size={18} />} type="email" placeholder="Email Address" value={email} onChange={setEmail} required />
          <AnimatedInput prefix={<Phone size={18} />} type="tel" placeholder="Phone Number (Optional)" value={phone} onChange={setPhone} />
          <AnimatedInput prefix={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={setPassword} required />

          <AnimatedButton type="submit" fullWidth disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </AnimatedButton>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <AnimatedButton variant="outline" fullWidth onClick={handleGoogleLogin}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18, marginRight: 8 }} />
              Sign Up with Google
            </AnimatedButton>
            <AnimatedButton variant="outline" fullWidth onClick={handleAppleLogin}>
              🍎 Sign Up with Apple
            </AnimatedButton>
            <AnimatedButton variant="outline" fullWidth onClick={handleFacebookLogin}>
              📘 Sign Up with Facebook
            </AnimatedButton>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
        </div>
      </motion.div>
    </div>
  );
}
