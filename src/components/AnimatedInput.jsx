import { motion } from 'motion/react';
import { useState } from 'react';
import { springs } from '../animations/presets';

export default function AnimatedInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  multiline = false,
  prefix,
  error,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const inputProps = {
    className: `form-input ${multiline ? 'form-textarea' : ''} ${error ? 'form-input--error' : ''}`,
    value,
    onChange: (e) => onChange(e.target.value),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    placeholder,
    style: {
      borderColor: error
        ? 'var(--color-danger)'
        : isFocused
        ? 'var(--color-primary)'
        : undefined,
      boxShadow: error
        ? '0 0 0 3px var(--color-danger-bg)'
        : isFocused
        ? '0 0 0 3px var(--color-primary-bg)'
        : undefined,
    },
  };

  return (
    <motion.div
      className="form-group"
      animate={error ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <motion.label
          className="form-label"
          animate={{
            color: isFocused
              ? 'var(--color-primary)'
              : error
              ? 'var(--color-danger)'
              : 'var(--color-text-secondary)',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontWeight: 500,
              pointerEvents: 'none',
            }}
          >
            {prefix}
          </span>
        )}
        {multiline ? (
          <textarea {...inputProps} rows={3} />
        ) : (
          <input
            {...inputProps}
            type={type}
            style={{
              ...inputProps.style,
              paddingLeft: prefix ? 40 : undefined,
            }}
          />
        )}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            height: 2,
            background: error ? 'var(--color-danger)' : 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
          }}
          initial={{ width: 0, x: '-50%' }}
          animate={{
            width: isFocused ? '100%' : '0%',
            x: '-50%',
          }}
          transition={springs.gentle}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: 'var(--color-danger)',
            fontSize: 'var(--font-size-xs)',
            marginTop: 'var(--space-1)',
          }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
