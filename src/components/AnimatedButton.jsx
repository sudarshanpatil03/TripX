import { motion } from 'motion/react';
import { useState, useCallback } from 'react';
import { springs } from '../animations/presets';

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  icon: Icon,
  loading = false,
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback(
    (e) => {
      if (disabled || loading) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const newRipple = { x, y, size, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      onClick?.(e);
    },
    [onClick, disabled, loading]
  );

  const classNames = [
    'btn',
    `btn--${variant}`,
    size === 'lg' && 'btn--lg',
    fullWidth && 'btn--full',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      className={classNames}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.03,
              boxShadow:
                variant === 'primary'
                  ? '0 8px 30px rgba(124, 58, 237, 0.35)'
                  : variant === 'danger'
                  ? '0 8px 30px rgba(239, 68, 68, 0.35)'
                  : '0 4px 16px rgba(0,0,0,0.1)',
            }
      }
      whileTap={disabled ? {} : { scale: 0.96, y: 1 }}
      transition={springs.bouncy}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 20,
            height: 20,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
          }}
        />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );
}
