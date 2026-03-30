import { motion } from 'framer-motion';

export default function GradientBlob({ color = 'var(--color-primary)', size = 600, opacity = 0.12, x = '0%', y = '0%', className = '' }) {
  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        x: [0, 10, -10, 0],
        y: [0, -10, 10, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
        zIndex: 0,
      }}
    />
  );
}
