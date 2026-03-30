import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, onClick, style }) {
  return (
    <motion.div
      className={`glass-card ${className}`}
      style={style}
      whileHover={hover ? { y: -4, borderColor: 'rgba(255,255,255,0.15)' } : undefined}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
