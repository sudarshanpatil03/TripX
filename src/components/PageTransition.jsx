import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router';

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        }}
        exit={{
          opacity: 0,
          y: -10,
          scale: 0.99,
          transition: { duration: 0.2 },
        }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
