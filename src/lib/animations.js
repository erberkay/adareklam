// ==================== SHARED ANIMATION VARIANTS ====================
// Tüm paylaşımlı Framer Motion variant'ları burada merkezi olarak tanımlanır.

export const pageVariants = {
  initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
  animate: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1 },
  },
  exit: {
    opacity: 0, y: -20, filter: 'blur(5px)',
    transition: { duration: 0.4 },
  },
};

export const revealVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  },
  clipReveal: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: 1, ease: [0.77, 0, 0.175, 1] },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export const navbarVariants = {
  initial: { y: -100, opacity: 0 },
  animate: {
    y: 0, opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: (i) => ({
    y: 0, opacity: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

export const mobileMenuVariants = {
  closed: { x: '100%', opacity: 0 },
  open: {
    x: 0, opacity: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

export const cardHoverVariants = {
  initial: { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: {
    y: -8,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export const easing = [0.4, 0, 0.2, 1];
