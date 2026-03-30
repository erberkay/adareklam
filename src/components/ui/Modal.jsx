import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizes = { sm: '480px', md: '640px', lg: '900px', xl: '1200px' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)', zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 1001, padding: '1rem',
            }}
          >
            <div
              className="glass-card"
              style={{
                width: '100%', maxWidth: sizes[size],
                maxHeight: '90vh', overflowY: 'auto',
                padding: '2rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                {title && (
                  <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  style={{
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                    borderRadius: '50%', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--color-text-secondary)',
                    transition: 'all 0.2s ease', marginLeft: 'auto',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
