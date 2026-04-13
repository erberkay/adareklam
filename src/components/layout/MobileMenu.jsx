import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '../../lib/firebase';
import { NAV_LINKS } from '../../lib/constants';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';

export default function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, userRole } = useAuthStore();
  const { pathname } = useLocation();
  const close = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Çıkış yapıldı');
      close();
    } catch (err) {
      toast.error('Çıkış yapılamadı: ' + err.message);
    }
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)', zIndex: 998,
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '300px', background: 'var(--color-bg-secondary)',
              borderLeft: '1px solid var(--glass-border)',
              zIndex: 999, padding: '2rem',
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}
          >
            <button
              onClick={close}
              style={{
                alignSelf: 'flex-end', background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)', borderRadius: '50%',
                width: '40px', height: '40px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-text-secondary)',
                marginBottom: '1rem',
              }}
            >
              <X size={18} />
            </button>
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  to={link.path}
                  onClick={close}
                  style={{
                    display: 'block', padding: '0.75rem 0',
                    fontFamily: 'Sora, sans-serif', fontWeight: 600,
                    fontSize: '1.1rem',
                    color: pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    borderBottom: '1px solid var(--glass-border)',
                    textDecoration: 'none', transition: 'color 0.2s ease',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              {user ? (
                <>
                  <Link
                    to={userRole === 'admin' ? '/admin' : '/musteri'}
                    onClick={close}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                  >
                    Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <LogOut size={16} /> Çıkış Yap
                  </button>
                </>
              ) : (
                <Link
                  to="/giris"
                  onClick={close}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                >
                  Giriş Yap
                </Link>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
