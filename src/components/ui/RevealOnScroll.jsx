import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { revealVariants } from '../../lib/animations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function RevealOnScroll({
  children,
  variant = 'fadeUp',
  delay = 0,
  className = '',
  threshold = 0.2,
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({ threshold, triggerOnce: true });

  if (reduced) return <div className={className}>{children}</div>;

  const chosen = revealVariants[variant] || revealVariants.fadeUp;
  const animVariant = {
    hidden: chosen.hidden,
    visible: {
      ...chosen.visible,
      transition: { ...chosen.visible.transition, delay },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={animVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}
