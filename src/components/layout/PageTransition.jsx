import { motion } from 'framer-motion';
import { pageVariants } from '../../lib/animations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function PageTransition({ children }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
