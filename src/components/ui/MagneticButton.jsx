import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/useMediaQuery';

export default function MagneticButton({ children, className = '', strength = 30 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  if (isMobile) return <div className={className}>{children}</div>;

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) / rect.width;
    const distY = (e.clientY - centerY) / rect.height;
    setPos({ x: distX * strength, y: distY * strength });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
