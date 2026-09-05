import { motion } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Plane, Compass, UserCircle, Plus } from 'lucide-react';
import { springs } from '../animations/presets';

const tabs = [
  { path: '/', label: 'My Trips', icon: Plane },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/profile', label: 'Profile', icon: UserCircle },
];

export default function MainNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="main-nav">
      <div className="main-nav__list">
        
        {/* Regular Tabs before FAB */}
        {tabs.slice(0, 2).map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
          const Icon = tab.icon;

          return (
            <Link key={tab.path} to={tab.path} style={{ textDecoration: 'none' }} className={`main-nav__item ${isActive ? 'active' : ''}`}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={springs.bouncy}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="nav-indicator"
                    transition={{ ...springs.bouncy }}
                  />
                )}
                <motion.div animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0, color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }} transition={springs.bouncy}>
                  <Icon size={22} />
                </motion.div>
                <span className="main-nav__label" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{tab.label}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* Central Floating Action Button for Create Trip */}
        <div className="main-nav__fab-container">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create-trip')}
            className="main-nav__fab"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-primary)',
              cursor: 'pointer',
              marginTop: -28,
              zIndex: 10
            }}
          >
            <Plus size={28} />
          </motion.button>
        </div>

        {/* Regular Tabs after FAB */}
        {tabs.slice(2).map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
          const Icon = tab.icon;

          return (
            <Link key={tab.path} to={tab.path} style={{ textDecoration: 'none' }} className={`main-nav__item ${isActive ? 'active' : ''}`}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={springs.bouncy}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="nav-indicator"
                    transition={{ ...springs.bouncy }}
                  />
                )}
                <motion.div animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0, color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }} transition={springs.bouncy}>
                  <Icon size={22} />
                </motion.div>
                <span className="main-nav__label" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{tab.label}</span>
              </motion.div>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}
