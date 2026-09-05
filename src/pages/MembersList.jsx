import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserPlus, Crown } from 'lucide-react';
import MemberAvatar from '../components/MemberAvatar';
import Badge from '../components/Badge';
import ThemeToggle from '../components/ThemeToggle';
import { staggerContainer, fadeInUp, fadeInRight, springs } from '../animations/presets';

const initialMembers = [
  { id: 1, name: 'Samarth (You)', phone: 'Trip Creator', role: 'owner', isYou: true },
  { id: 2, name: 'Rohit', phone: '94000000XX', role: 'admin' },
  { id: 3, name: 'Akash', phone: '97XXXX00XX', role: 'member' },
  { id: 4, name: 'Pratik', phone: '96XXXXXXXX', role: 'member' },
  { id: 5, name: 'Om', phone: '95XXXXXXXX', role: 'member' },
];

const invitedMembers = [
  { id: 6, name: 'Amit', phone: '9160XXXXXXX', role: 'pending' },
];

export default function MembersList() {
  const navigate = useNavigate();
  const [members] = useState(initialMembers);
  const [invited] = useState(invitedMembers);

  return (
    <div>
      {/* Header */}
      <motion.header
        className="header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ width: 36 }} />
        <motion.h1
          className="header__title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Members
        </motion.h1>
        <ThemeToggle />
      </motion.header>

      <div className="page-content">
        {/* Add Member button */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div />
          <motion.button
            className="section-action"
            onClick={() => navigate('/add-member')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.bouncy}
          >
            <UserPlus size={16} />
            <span>+ Add Member</span>
          </motion.button>
        </motion.div>

        {/* Active Members */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                className="member-item"
                variants={fadeInRight}
                layout
                whileHover={{
                  x: 4,
                  backgroundColor: 'var(--color-surface-hover)',
                }}
                transition={springs.gentle}
                style={{ borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <MemberAvatar
                  name={member.name}
                  showRing={member.role === 'owner'}
                />
                <div className="member-info">
                  <div className="member-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {member.name}
                    {member.role === 'owner' && (
                      <motion.span
                        className="crown-icon"
                        animate={{
                          y: [0, -3, 0],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        👑
                      </motion.span>
                    )}
                  </div>
                  <div className="member-subtitle">{member.phone}</div>
                </div>
                <Badge type={member.role}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Invited Members */}
        {invited.length > 0 && (
          <>
            <motion.div
              className="divider"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.h3
              className="section-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ marginBottom: 'var(--space-3)' }}
            >
              Invited Members
            </motion.h3>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              transition={{ delayChildren: 0.6 }}
            >
              {invited.map((member) => (
                <motion.div
                  key={member.id}
                  className="member-item"
                  variants={fadeInRight}
                  style={{ opacity: 0.8 }}
                >
                  <MemberAvatar name={member.name} />
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-subtitle">{member.phone}</div>
                  </div>
                  <Badge type="pending">Pending</Badge>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="waiting-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Waiting to join...
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
}
