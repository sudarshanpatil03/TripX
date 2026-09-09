import { Outlet, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Home, Compass, User, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalChatbot from './GlobalChatbot';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: 'ai_bot', label: 'TripX AI', icon: Bot },
    { path: '/profile', label: 'Profile', icon: profile?.avatar_url ? 'avatar' : User },
  ];
  
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="app-container">
      <div className="bg-orbs">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
      </div>

      <div className="main-content" style={{ paddingBottom: 80 }}>
        <Outlet />
      </div>

      {/* Bottom Navigation — premium glass + glow */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-around', padding: 'var(--space-2) var(--space-4)', paddingBottom: 'calc(var(--space-2) + env(safe-area-inset-bottom))', zIndex: 100, boxShadow: '0 -12px 32px rgba(0,0,0,0.08)' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                if (item.path === 'ai_bot') {
                  setIsAIOpen(!isAIOpen);
                } else {
                  navigate(item.path);
                  setIsAIOpen(false); // Close AI when navigating
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: 'transparent',
                border: 'none',
                padding: 'var(--space-2)',
                position: 'relative',
              }}
            >
              {item.icon === 'avatar' ? (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', overflow: 'hidden',
                  border: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`
                }}>
                  <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <item.icon size={24} />
              )}
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="mainNavIndicator"
                  style={{
                    position: 'absolute',
                    top: -2,
                    width: 24,
                    height: 3,
                    background: 'var(--color-primary)',
                    borderRadius: '0 0 4px 4px'
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
      
      {/* The AI Assistant Drawer */}
      <GlobalChatbot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
