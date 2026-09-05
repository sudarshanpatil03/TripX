import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { dropdownVariants, springs } from '../animations/presets';

export default function AnimatedDropdown({
  label,
  options,
  value,
  onChange,
  icon: Icon,
  placeholder = 'Select...',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="select-wrapper" ref={wrapperRef}>
        <motion.button
          type="button"
          className={`select-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.99 }}
        >
          <div className="select-trigger__content">
            {Icon && (
              <motion.div
                className="select-trigger__icon"
                animate={{ rotate: isOpen ? 5 : 0 }}
                transition={springs.bouncy}
              >
                <Icon size={18} />
              </motion.div>
            )}
            <span style={{ color: selected ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
              {selected ? selected.label : placeholder}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={springs.bouncy}
          >
            <ChevronDown size={18} color="var(--color-text-muted)" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="select-dropdown"
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {options.map((option, i) => (
                <motion.div
                  key={option.value}
                  className={`select-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, ...springs.gentle }}
                  whileHover={{ x: 4, backgroundColor: 'var(--color-surface-hover)' }}
                >
                  {option.icon && (
                    <div className="select-trigger__icon">
                      <option.icon size={18} />
                    </div>
                  )}
                  <span style={{ flex: 1 }}>{option.label}</span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springs.bouncy}
                    >
                      <Check size={16} color="var(--color-primary)" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
