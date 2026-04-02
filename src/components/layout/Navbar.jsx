import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { NAV_LINKS } from '../../lib/constants';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';
import { useScrollY } from '../../hooks/useScrollProgress';
import { navItemVariants } from '../../lib/animations';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';

export default function Navbar() {
  const scrollY = useScrollY();
  const { setMobileMenuOpen } = useUIStore();
  const { user, userRole } = useAuthStore();
  const { siteName, logo } = useSiteSettingsStore((s) => s.settings);
  const { pathname } = useLocation();
  const scrolled = scrollY > 80;

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Çıkış yapıldı');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: scrolled ? '12px 0' : '24px 0',
        background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.2)' : 'none',
        transition: 'padding 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.span whileHover={{ scale: 1.03 }} style={{ display: 'flex', alignItems: 'center' }}>
            {logo ? (
              <img
                src={logo}
                alt={siteName}
                style={{ height: '36px', maxWidth: '140px', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <span style={{
                fontFamily: 'Sora, sans-serif', fontWeight: 800,
                fontSize: '1.3rem', letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {siteName}
              </span>
            )}
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
          {NAV_LINKS.map((link, i) => (
            <motion.div key={link.path} custom={i} variants={navItemVariants} initial="hidden" animate="visible" style={{ position: 'relative' }}>
              <Link
                to={link.path}
                style={{
                  textDecoration: 'none', padding: '6px 14px', borderRadius: '50px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem',
                  color: pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  transition: 'color 0.2s ease',
                  display: 'block',
                }}
              >
                {link.label}
                {pathname === link.path && (
                  <motion.span
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute', bottom: '-2px', left: '14px', right: '14px',
                      height: '2px', background: 'var(--color-primary)', borderRadius: '1px',
                    }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link
                to={userRole === 'admin' ? '/admin' : '/musteri'}
                className="btn-ghost"
                style={{ padding: '8px 20px', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                Panel
              </Link>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
                Çıkış
              </button>
            </div>
          ) : (
            <Link to="/giris" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Giriş Yap
            </Link>
          )}
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
            style={{
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              borderRadius: '8px', padding: '8px', cursor: 'pointer',
              color: 'var(--color-text-primary)',
            }}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
