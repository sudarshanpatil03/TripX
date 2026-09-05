// ═══════════════════════════════════════════════════════
// TripX WebApp — Animation Presets
// Reusable motion variants for consistent, premium feel
// ═══════════════════════════════════════════════════════

// ─── Spring Configs ──────────────────────────────────
export const springs = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  bouncy: { type: "spring", stiffness: 300, damping: 20 },
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  slow: { type: "spring", stiffness: 80, damping: 20 },
};

// ─── Page Transitions ────────────────────────────────
export const pageSlideRight = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { ...springs.gentle, opacity: { duration: 0.3 } } },
  exit: { x: "-30%", opacity: 0, transition: { duration: 0.25 } },
};

export const pageSlideLeft = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { ...springs.gentle, opacity: { duration: 0.3 } } },
  exit: { x: "30%", opacity: 0, transition: { duration: 0.25 } },
};

export const pageFadeScale = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// ─── Stagger Containers ──────────────────────────────
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

// ─── Item Entrance Variants ──────────────────────────
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...springs.gentle },
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { ...springs.gentle },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { ...springs.gentle },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { ...springs.bouncy },
  },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { ...springs.bouncy },
  },
};

// ─── Gesture Animations ──────────────────────────────
export const tapScale = {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
  transition: springs.snappy,
};

export const buttonTap = {
  whileTap: { scale: 0.95, y: 1 },
  whileHover: {
    scale: 1.03,
    boxShadow: "0 8px 30px rgba(124, 58, 237, 0.3)",
  },
  transition: springs.bouncy,
};

export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.3 },
  },
};

// ─── Error / Feedback ────────────────────────────────
export const shake = {
  x: [0, -10, 10, -10, 10, -5, 5, 0],
  transition: { duration: 0.5 },
};

export const successPulse = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.3 },
};

// ─── List Item Removal ───────────────────────────────
export const listItemExit = {
  exit: {
    opacity: 0,
    x: -100,
    height: 0,
    marginBottom: 0,
    padding: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

// ─── Floating Background Orbs ────────────────────────
export const floatingOrb = (delay = 0) => ({
  animate: {
    y: [0, -20, 0, 15, 0],
    x: [0, 10, -10, 5, 0],
    scale: [1, 1.1, 1, 0.95, 1],
    transition: {
      duration: 8 + delay * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    },
  },
});

// ─── Checkbox Toggle ─────────────────────────────────
export const checkboxVariants = {
  unchecked: { scale: 1, borderColor: "var(--color-border)" },
  checked: {
    scale: [1, 1.2, 1],
    borderColor: "var(--color-primary)",
    backgroundColor: "var(--color-primary)",
    transition: { ...springs.bouncy },
  },
};

// ─── Dropdown Variants ───────────────────────────────
export const dropdownVariants = {
  closed: {
    opacity: 0,
    scaleY: 0.8,
    y: -8,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    transition: { ...springs.bouncy },
  },
};

// ─── Tab Indicator ───────────────────────────────────
export const tabIndicator = {
  layout: true,
  transition: { ...springs.bouncy },
};

// ─── Shimmer Loading ─────────────────────────────────
export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};
