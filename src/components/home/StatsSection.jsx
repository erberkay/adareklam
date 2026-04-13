import RevealOnScroll from '../ui/RevealOnScroll';
import AnimatedCounter from '../ui/AnimatedCounter';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';

export default function StatsSection() {
  const stats = useSiteSettingsStore((s) => s.settings.stats);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const items = [
    { value: stats?.projectCount || 150, suffix: '+', label: 'Tamamlanan Proje' },
    { value: stats?.clientCount || 80, suffix: '+', label: 'Mutlu Müşteri' },
    { value: stats?.yearExperience || 5, suffix: '', label: 'Yıl Deneyim' },
    { value: stats?.photoCount || 10000, suffix: '+', label: 'Çekilen Fotoğraf' },
  ];

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
        background: 'linear-gradient(135deg, rgba(200,164,92,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div className="container">
        <RevealOnScroll variant="fadeUp" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Rakamlarla Biz</span>
          <h2 className="heading-section" style={{ marginTop: '0.75rem', color: 'var(--color-text-primary)' }}>
            Güvenilir Deneyim,
            <br /><span className="gradient-text">Kanıtlanmış Başarı</span>
          </h2>
        </RevealOnScroll>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="glass-card"
              style={{ padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
              }} />
              <div style={{
                fontFamily: 'Sora, sans-serif', fontWeight: 800,
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                color: 'var(--color-primary)',
                letterSpacing: '-0.03em',
              }}>
                <AnimatedCounter target={item.value} suffix={item.suffix} />
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
