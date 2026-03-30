import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TextReveal from '../ui/TextReveal';
import GradientBlob from '../ui/GradientBlob';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIsMobile } from '../../hooks/useMediaQuery';

export default function HeroSection() {
  const settings = useSiteSettingsStore((s) => s.settings);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX = useTransform(mouseX, [-1, 1], [-15, 15]);
  const bgY = useTransform(mouseY, [-1, 1], [-15, 15]);
  const springX = useSpring(bgX, { stiffness: 50, damping: 20 });
  const springY = useSpring(bgY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e) => {
    if (reduced || isMobile) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const heroImg = settings.heroImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80';

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', height: '100vh', minHeight: '600px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image with parallax */}
      <motion.div
        style={{
          position: 'absolute', inset: '-10%',
          x: reduced ? 0 : springX,
          y: reduced ? 0 : springY,
        }}
      >
        <motion.img
          src={heroImg}
          alt=""
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0.95) 100%)',
        zIndex: 1,
      }} />

      {/* Blobs */}
      <GradientBlob size={500} opacity={0.08} x="10%" y="30%" />
      <GradientBlob size={400} opacity={0.06} x="80%" y="60%" color="var(--color-primary-light)" />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Tagline */}
        <motion.div
          initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          style={{ display: 'inline-block', marginBottom: '1.25rem' }}
        >
          <span className="section-label">{settings.tagline}</span>
        </motion.div>

        {/* Main Title */}
        <TextReveal
          text={settings.siteName}
          className="hero-title gradient-text"
          style={{ justifyContent: 'center' }}
          delay={0.6}
          stagger={0.15}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '600px', margin: '1.5rem auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          Profesyonel fotoğraf çekimi, reklam tasarımı ve dijital pazarlama çözümleriyle
          markanızı bir adım öne taşıyoruz.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/portfolyo" className="btn-primary" style={{ textDecoration: 'none' }}>
            Çalışmalarımız <ArrowRight size={16} />
          </Link>
          <Link to="/iletisim" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Teklif Al
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          color: 'var(--color-text-muted)',
        }}
      >
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Kaydır</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
