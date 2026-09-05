import { motion } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Receipt, Users, Settings, UserCircle } from 'lucide-react';
import { springs } from '../animations/presets';

const tabs = [
  { path: '/', label: 'Expenses', icon: Receipt },
  { path: '/members', label: 'Members', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/add-member', label: 'Add', icon: UserCircle },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__list">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link key={tab.path} to={tab.path} style={{ textDecoration: 'none' }}>
              <motion.div
                className={`bottom-nav__item ${isActive ? 'active' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={springs.bouncy}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 24,
                      height: 3,
                      background: 'var(--gradient-primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                    transition={{ ...springs.bouncy }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={springs.bouncy}
                >
                  <Icon size={22} />
                </motion.div>
                <span className="bottom-nav__label">{tab.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
