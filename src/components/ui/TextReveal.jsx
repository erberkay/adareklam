import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function TextReveal({ text, className = '', delay = 0, stagger = 0.15, as: Tag = 'h1' }) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const words = text.split(' ');

  if (reduced) return <Tag className={className}>{text}</Tag>;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const wordVariant = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em', overflow: 'hidden' }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span variants={wordVariant} style={{ display: 'inline-block' }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
