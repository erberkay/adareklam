import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { MessageCircle } from 'lucide-react';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';

export default function Layout({ children }) {
  const progress = useScrollProgress();
  const { pathname } = useLocation();
  const settings = useSiteSettingsStore((s) => s.settings);
  const isPanelPage = pathname.startsWith('/admin') || pathname.startsWith('/musteri');

  if (isPanelPage) return <>{children}</>;

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
      />
      <Navbar />
      <MobileMenu />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <Footer />
      {/* WhatsApp float */}
      {settings.socialMedia?.whatsapp && (
        <WhatsAppFloat phone={settings.socialMedia.whatsapp} />
      )}
    </>
  );
}

function WhatsAppFloat({ phone }) {
  const [hovered, setHovered] = useState(false);
  const number = phone.replace(/\D/g, '');

  return (
    <motion.a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.05 : 1 }}
      style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 800,
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: '#25D366', borderRadius: '50px',
        padding: hovered ? '12px 20px' : '12px',
        color: '#fff', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
        transition: 'padding 0.3s ease, border-radius 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 2 }}
      >
        <MessageCircle size={22} />
      </motion.span>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            Bize Yazın
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
