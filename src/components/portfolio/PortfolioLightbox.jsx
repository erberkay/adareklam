import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PortfolioLightbox({ item, onClose }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = item?.images || [item?.thumbnail];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setImgIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setImgIndex((i) => Math.min(images.length - 1, i + 1));
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, images.length]);

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', zIndex: 2000 }}
          />
          <motion.div
            layoutId={`portfolio-${item.id}`}
            style={{
              position: 'fixed', inset: '2rem', zIndex: 2001,
              display: 'flex', flexDirection: 'column',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div>
                <p className="section-label">{item.category?.replace(/-/g, ' ')}</p>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-primary)', marginTop: '2px' }}>{item.title}</h3>
              </div>
              <button onClick={onClose} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Image */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIndex}
                  src={images[imgIndex]}
                  alt={item.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIndex((i) => Math.max(0, i - 1))} style={{ ...navBtn, left: '1rem' }}><ChevronLeft size={20} /></button>
                  <button onClick={() => setImgIndex((i) => Math.min(images.length - 1, i + 1))} style={{ ...navBtn, right: '1rem' }}><ChevronRight size={20} /></button>
                  <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIndex(i)} style={{ width: i === imgIndex ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === imgIndex ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'width 0.3s ease' }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Meta */}
            {(item.client || item.description) && (
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                {item.client && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Müşteri: <span style={{ color: 'var(--color-text-secondary)' }}>{item.client}</span></p>}
                {item.description && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>{item.description}</p>}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const navBtn = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.6)', border: '1px solid var(--glass-border)',
  borderRadius: '50%', width: '44px', height: '44px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#fff',
};
