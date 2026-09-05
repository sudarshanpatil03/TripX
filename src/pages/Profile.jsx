import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, Camera, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import ThemeToggle from '../components/ThemeToggle';
import { staggerContainer, fadeInUp, springs } from '../animations/presets';

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: profile?.name || user?.user_metadata?.full_name || '',
    phone: profile?.phone || '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      let avatar_url = profile?.avatar_url;

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `avatars/${user.id}/${Date.now()}.${fileExt}`;
        
        // Reusing receipts bucket as specified in plan
        const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, photoFile);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
        avatar_url = publicUrl;
      }

      const { error } = await updateProfile({
        name: form.name,
        phone: form.phone,
        avatar_url
      });

      if (error) throw error;
      
      setSuccess(true);
      setPhotoFile(null); // Reset after successful upload
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Preview URL for the avatar
  const avatarSrc = photoFile ? URL.createObjectURL(photoFile) : profile?.avatar_url;

  return (
    <div className="app-container">
      <div className="main-content">
        <motion.header
          className="header"
          initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="header__back"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <motion.h1
          className="header__title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Profile
        </motion.h1>
        <ThemeToggle />
      </motion.header>

      <main style={{ padding: 'var(--space-6)', maxWidth: 600, margin: '0 auto' }}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
        >
          {/* Avatar Section */}
          <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ position: 'relative' }}>
              <motion.div 
                style={{ 
                  width: 120, height: 120, borderRadius: '50%', background: 'var(--color-primary-bg)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  border: '4px solid var(--color-surface)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={48} color="var(--color-primary)" />
                )}
              </motion.div>
              
              <label style={{ 
                position: 'absolute', bottom: 0, right: 0, 
                width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)', border: '3px solid var(--color-surface)'
              }}>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <Camera size={16} />
              </label>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0 }}>{profile?.name || user?.user_metadata?.full_name}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: '4px 0 0' }}>{user?.email}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} style={{ background: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Personal Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <AnimatedInput 
                label="Full Name" 
                value={form.name} 
                onChange={v => setForm({...form, name: v})} 
                icon={<User size={18} />} 
              />
              
              <AnimatedInput 
                label="Email (Cannot be changed)" 
                value={user?.email || ''} 
                onChange={() => {}} 
                icon={<Mail size={18} />} 
                disabled
              />
              
              <AnimatedInput 
                label="Phone Number" 
                value={form.phone} 
                onChange={v => setForm({...form, phone: v})} 
                icon={<Phone size={18} />} 
                placeholder="+1 234 567 8900"
              />

              <div style={{ marginTop: 'var(--space-2)' }}>
                <AnimatedButton variant="primary" onClick={handleSave} loading={saving}>
                  {success ? <><CheckCircle size={18} style={{ marginRight: 8 }} /> Saved!</> : 'Save Changes'}
                </AnimatedButton>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <AnimatedButton variant="danger" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <LogOut size={18} style={{ marginRight: 8 }} /> Sign Out
            </AnimatedButton>
          </motion.div>
          
        </motion.div>
      </main>
      </div>
    </div>
  );
}
