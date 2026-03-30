import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { staggerItem } from '../../lib/animations';

export default function PortfolioItem({ item, onClick }) {
  return (
    <motion.div
      layoutId={`portfolio-${item.id}`}
      variants={staggerItem}
      whileHover="hover"
      onClick={() => onClick(item)}
      style={{
        position: 'relative', borderRadius: '16px', overflow: 'hidden',
        aspectRatio: '4/3', cursor: 'pointer',
        border: '1px solid transparent', transition: 'border-color 0.4s ease',
      }}
    >
      <motion.img
        src={item.thumbnail}
        alt={item.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(0px)' }}
        variants={{ hover: { scale: 1.08, filter: 'blur(0px)' } }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        variants={{ hover: { opacity: 1 } }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(200,164,92,0.15) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          variants={{ hover: { opacity: 1, scale: 1, rotate: 90 } }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'var(--color-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ZoomIn size={20} style={{ color: '#000' }} />
        </motion.div>
        <motion.span
          initial={{ x: -10, opacity: 0 }}
          variants={{ hover: { x: 0, opacity: 1 } }}
          transition={{ duration: 0.3 }}
          className="section-label" style={{ marginBottom: '4px' }}
        >
          {item.category?.replace(/-/g, ' ')}
        </motion.span>
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          variants={{ hover: { y: 0, opacity: 1 } }}
          transition={{ duration: 0.3, delay: 0.05 }}
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}
        >
          {item.title}
        </motion.h3>
      </motion.div>
    </motion.div>
  );
}
