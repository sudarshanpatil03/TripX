import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Check } from 'lucide-react';
import MemberAvatar from '../components/MemberAvatar';
import AnimatedButton from '../components/AnimatedButton';
import ThemeToggle from '../components/ThemeToggle';
import { staggerContainer, fadeInUp, fadeInRight, springs } from '../animations/presets';

const tripxUsers = [
  { id: 1, name: 'Akash Kumar', phone: '96XXXXXXXX' },
  { id: 2, name: 'Rohit Sharma', phone: '97XXXXXXXX' },
  { id: 3, name: 'Neha Patil', phone: '96XXXXXXXX' },
];

const nonTripxUsers = [
  { id: 4, name: 'Amit Jadhav', phone: '91100XXXXX' },
  { id: 5, name: 'Priya More', phone: '91100XXXXX' },
];

export default function AddMember() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(new Set([1, 2, 4]));
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleSelection = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredTripx = tripxUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredNonTripx = nonTripxUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <motion.header
        className="header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="header__back"
          onClick={() => navigate(-1)}
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
          Add Member
        </motion.h1>
        <ThemeToggle />
      </motion.header>

      <div className="page-content">
        {/* Search Bar */}
        <motion.div
          className="search-bar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            borderColor: searchFocused ? 'var(--color-primary)' : undefined,
            boxShadow: searchFocused ? '0 0 0 3px var(--color-primary-bg)' : undefined,
          }}
        >
          <motion.div
            animate={{ scale: searchFocused ? 1.1 : 1 }}
            transition={springs.bouncy}
          >
            <Search size={18} className="search-bar__icon" />
          </motion.div>
          <input
            className="search-bar__input"
            placeholder="Search in contacts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </motion.div>

        {/* TripX Users Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3
            className="section-title"
            style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}
          >
            TripX Users in Your Contacts
          </h3>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredTripx.map((user) => {
                const isSelected = selected.has(user.id);
                return (
                  <motion.div
                    key={user.id}
                    className="member-item"
                    variants={fadeInRight}
                    layout
                    onClick={() => toggleSelection(user.id)}
                    whileHover={{
                      backgroundColor: 'var(--color-surface-hover)',
                    }}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isSelected
                        ? 'var(--color-primary-bg)'
                        : 'transparent',
                    }}
                  >
                    <MemberAvatar name={user.name} />
                    <div className="member-info">
                      <div className="member-name">{user.name}</div>
                      <div className="member-subtitle">{user.phone}</div>
                    </div>
                    <motion.div
                      className={`checkbox ${isSelected ? 'checked' : ''}`}
                      animate={{
                        scale: isSelected ? [1, 1.2, 1] : 1,
                        backgroundColor: isSelected
                          ? 'var(--color-primary)'
                          : 'transparent',
                        borderColor: isSelected
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                      }}
                      transition={springs.bouncy}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={springs.bouncy}
                          >
                            <Check size={14} color="white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Non-TripX Users Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ transformOrigin: 'left' }}
          />

          <h3
            className="section-title"
            style={{ marginBottom: 'var(--space-3)' }}
          >
            Not on TripX (Will be invited)
          </h3>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            transition={{ delayChildren: 0.55 }}
          >
            <AnimatePresence>
              {filteredNonTripx.map((user) => {
                const isSelected = selected.has(user.id);
                return (
                  <motion.div
                    key={user.id}
                    className="member-item"
                    variants={fadeInRight}
                    layout
                    onClick={() => toggleSelection(user.id)}
                    whileHover={{
                      backgroundColor: 'var(--color-surface-hover)',
                    }}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isSelected
                        ? 'var(--color-primary-bg)'
                        : 'transparent',
                    }}
                  >
                    <MemberAvatar name={user.name} />
                    <div className="member-info">
                      <div className="member-name">{user.name}</div>
                      <div className="member-subtitle">{user.phone}</div>
                    </div>
                    <motion.div
                      className={`checkbox ${isSelected ? 'checked' : ''}`}
                      animate={{
                        scale: isSelected ? [1, 1.2, 1] : 1,
                        backgroundColor: isSelected
                          ? 'var(--color-primary)'
                          : 'transparent',
                        borderColor: isSelected
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                      }}
                      transition={springs.bouncy}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={springs.bouncy}
                          >
                            <Check size={14} color="white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Invite Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ marginTop: 'var(--space-6)' }}
        >
          <AnimatedButton
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => console.log('Invite', [...selected])}
          >
            Invite & Add ({selected.size})
          </AnimatedButton>
        </motion.div>
      </div>
    </div>
  );
}
