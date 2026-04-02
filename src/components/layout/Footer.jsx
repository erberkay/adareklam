import { Link } from 'react-router-dom';
import { AtSign, Share2, PlayCircle, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import RevealOnScroll from '../ui/RevealOnScroll';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';
import { NAV_LINKS } from '../../lib/constants';

export default function Footer() {
  const { settings } = useSiteSettingsStore();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '4rem', paddingBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* BG decoration */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', opacity: 0.03, pointerEvents: 'none' }} />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <RevealOnScroll variant="fadeUp">
            <div>
              {settings.logo ? (
                <img src={settings.logo} alt={settings.siteName} style={{ height: '40px', maxWidth: '160px', objectFit: 'contain', display: 'block' }} />
              ) : (
                <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {settings.siteName}
                </span>
              )}
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
                {settings.tagline}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                {settings.socialMedia?.instagram && (
                  <SocialLink href={settings.socialMedia.instagram} icon={<AtSign size={16} />} />
                )}
                {settings.socialMedia?.facebook && (
                  <SocialLink href={settings.socialMedia.facebook} icon={<Share2 size={16} />} />
                )}
                {settings.socialMedia?.youtube && (
                  <SocialLink href={settings.socialMedia.youtube} icon={<PlayCircle size={16} />} />
                )}
                {settings.socialMedia?.whatsapp && (
                  <SocialLink href={`https://wa.me/${settings.socialMedia.whatsapp.replace(/\D/g, '')}`} icon={<MessageCircle size={16} />} />
                )}
              </div>
            </div>
          </RevealOnScroll>

          {/* Links */}
          <RevealOnScroll variant="fadeUp" delay={0.1}>
            <div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>Sayfalar</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {NAV_LINKS.map((link) => (
                  <Link key={link.path} to={link.path} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </RevealOnScroll>

          {/* Contact */}
          <RevealOnScroll variant="fadeUp" delay={0.2}>
            <div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>İletişim</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', alignItems: 'center' }}>
                    <Phone size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    {settings.phone}
                  </a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', alignItems: 'center' }}>
                    <Mail size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    {settings.email}
                  </a>
                )}
                {settings.address && (
                  <span style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem', alignItems: 'flex-start' }}>
                    <MapPin size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                    {settings.address}
                  </span>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            © {year} {settings.siteName}. Tüm hakları saklıdır.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            Kuşadası, Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
      style={{
        width: '36px', height: '36px', borderRadius: '50%',
        border: '1px solid var(--glass-border)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-text-secondary)', transition: 'all 0.3s ease',
      }}
    >
      {icon}
    </motion.a>
  );
}
