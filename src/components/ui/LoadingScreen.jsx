import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUIStore from '../../store/useUIStore';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';

export default function LoadingScreen() {
  const { loadingScreenDone, setLoadingScreenDone } = useUIStore();
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);

  useEffect(() => {
    const timer = setTimeout(setLoadingScreenDone, 2200);
    return () => clearTimeout(timer);
  }, [setLoadingScreenDone]);

  return (
    <AnimatePresence>
      {!loadingScreenDone && (
        <motion.div
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--color-bg-primary)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1rem',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ textAlign: 'center' }}
          >
            <span
              style={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {siteName}
            </span>
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{ height: '2px', background: 'var(--color-primary)', borderRadius: '1px' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
