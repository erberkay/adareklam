import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from '../ui/RevealOnScroll';
import GradientBlob from '../ui/GradientBlob';

export default function CTASection() {
  return (
    <section
      className="section-padding"
      style={{
        background: 'var(--color-bg-primary)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(200,164,92,0.06) 0%, transparent 60%)',
      }} />
      <GradientBlob size={600} opacity={0.06} x="50%" y="50%" />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <RevealOnScroll variant="fadeUp">
          <span className="section-label">Hazır Mısınız?</span>
          <h2 className="heading-section" style={{ marginTop: '0.75rem', color: 'var(--color-text-primary)' }}>
            Projenizi<br /><span className="gradient-text">Hayata Geçirelim</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: '1.5rem 0 2.5rem', lineHeight: 1.7 }}>
            Markanız için en iyi çözümü birlikte tasarlayalım.
            Ücretsiz danışmanlık için hemen iletişime geçin.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/iletisim" className="btn-primary" style={{ textDecoration: 'none' }}>
              Teklif Al <ArrowRight size={16} />
            </Link>
            <Link to="/portfolyo" className="btn-ghost" style={{ textDecoration: 'none' }}>
              Portfolyomuzu Gör
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
