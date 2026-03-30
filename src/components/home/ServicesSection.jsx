import { motion } from 'framer-motion';
import { Camera, Megaphone, Globe, AtSign, Package, Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../ui/RevealOnScroll';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { useInView } from 'react-intersection-observer';

const SERVICES = [
  { icon: Camera, title: 'Fotoğraf Çekimi', desc: 'Profesyonel stüdyo ve doğal ortam çekimleriyle markanızın hikayesini en güzel şekilde aktarıyoruz.', color: '#c8a45c' },
  { icon: Package, title: 'Ürün Çekimi', desc: 'E-ticaret ve katalog için beyaz fon, yaratıcı konsept ve lifestyle ürün fotoğrafçılığı.', color: '#dfc07a' },
  { icon: Globe, title: 'Web Sitesi Yapımı', desc: 'Modern, hızlı ve mobil uyumlu web siteleriyle dijital varlığınızı güçlendiriyoruz.', color: '#a8873d' },
  { icon: Megaphone, title: 'İşletme Reklamcılığı', desc: 'Google Ads, Meta Ads ve yerel reklam stratejileriyle işletmenizi doğru kitleye ulaştırıyoruz.', color: '#c8a45c' },
  { icon: AtSign, title: 'Instagram Yönetimi', desc: 'İçerik üretimi, planlama ve etkileşim yönetimiyle sosyal medya profilinizi büyütüyoruz.', color: '#dfc07a' },
  { icon: Clapperboard, title: 'Video Prodüksiyon', desc: 'Tanıtım filmleri, reels içerikler ve kurumsal video çözümleri sunuyoruz.', color: '#a8873d' },
];

export default function ServicesSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="section-padding" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <RevealOnScroll variant="fadeUp" className="text-center" style={{ marginBottom: '3.5rem' }}>
          <span className="section-label">Hizmetlerimiz</span>
          <h2 className="heading-section" style={{ marginTop: '0.75rem', color: 'var(--color-text-primary)' }}>
            Markanız İçin<br />
            <span className="gradient-text">Her Şeyi Yapıyoruz</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '1rem auto 0', fontSize: '1rem', lineHeight: 1.7 }}>
            Kuşadası ve çevresinde profesyonel reklam ve kreatif hizmetler sunuyoruz.
          </p>
        </RevealOnScroll>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {SERVICES.map((svc, i) => (
            <ServiceCard key={i} {...svc} />
          ))}
        </motion.div>

        <RevealOnScroll variant="fadeUp" delay={0.3} className="text-center" style={{ marginTop: '3rem' }}>
          <Link to="/hizmetler" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Tüm Hizmetlerimiz →
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, desc, color }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8, borderColor: 'rgba(255,255,255,0.15)' }}
      className="glass-card"
      style={{ padding: '2rem', cursor: 'default', position: 'relative', overflow: 'hidden' }}
    >
      {/* bg glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.12 }}
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '52px', height: '52px', borderRadius: '12px',
          background: `rgba(200, 164, 92, 0.1)`, border: '1px solid rgba(200,164,92,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Icon size={24} style={{ color: 'var(--color-primary)' }} />
      </motion.div>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
        {desc}
      </p>
    </motion.div>
  );
}
