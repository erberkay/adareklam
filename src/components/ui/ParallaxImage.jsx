import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ParallaxImage({ src, alt = '', ratio = 0.3, className = '', style }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-ratio * 100}px`, `${ratio * 100}px`]);

  return (
    <div ref={ref} style={{ overflow: 'hidden', ...style }} className={className}>
      <motion.img
        src={src}
        alt={alt}
        style={{
          width: '100%', height: '110%', objectFit: 'cover',
          y: reduced ? 0 : y,
        }}
      />
    </div>
  );
}
