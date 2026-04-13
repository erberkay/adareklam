import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useCollection, where, orderBy, limit } from '../../hooks/useFirestore';
import RevealOnScroll from '../ui/RevealOnScroll';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { useInView } from 'react-intersection-observer';
import { SkeletonCard } from '../ui/Skeleton';
import { useIsMobile } from '../../hooks/useMediaQuery';

const DEMO_ITEMS = [
  { id: 1, title: 'Ürün Fotoğrafı', category: 'urun-cekimi', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { id: 2, title: 'Mekan Çekimi', category: 'mekan-cekimi', thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  { id: 3, title: 'Reklam Tasarımı', category: 'reklam', thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80' },
  { id: 4, title: 'Sosyal Medya', category: 'sosyal-medya', thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80' },
  { id: 5, title: 'Web Tasarım', category: 'web-tasarim', thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80' },
  { id: 6, title: 'Ürün Stüdyo', category: 'urun-cekimi', thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
];

export default function PortfolioPreview() {
  const isMobile = useIsMobile();
  const { data: portfolio, loading } = useCollection('portfolio', [where('isFeatured', '==', true), limit(6)]);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const items = portfolio?.length ? portfolio : DEMO_ITEMS;

  return (
    <section className="section-padding" style={{ background: 'var(--color-bg-tertiary)' }}>
      <div className="container">
        <RevealOnScroll variant="fadeUp" style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3.5rem' }}>
          <span className="section-label">Portfolyo</span>
          <h2 className="heading-section" style={{ marginTop: '0.75rem', color: 'var(--color-text-primary)' }}>
            Seçkin<br /><span className="gradient-text">Çalışmalarımız</span>
          </h2>
        </RevealOnScroll>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
          >
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}

        <RevealOnScroll variant="fadeUp" delay={0.3} style={{ textAlign: 'center', marginTop: isMobile ? '2rem' : '3.5rem' }}>
          <Link to="/portfolyo" className="btn-primary" style={{ textDecoration: 'none' }}>
            Tüm Çalışmalar <ArrowUpRight size={16} />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function PortfolioCard({ item }) {
  return (
    <motion.div
      variants={staggerItem}
      style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }}
      whileHover="hover"
    >
      <motion.img
        src={item.thumbnail}
        alt={item.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        variants={{ hover: { scale: 1.08 } }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(200,164,92,0.2) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem',
        }}
      >
        <motion.span
          variants={{ hover: { x: 0, opacity: 1 } }}
          initial={{ x: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="section-label"
          style={{ marginBottom: '0.4rem' }}
        >
          {item.category?.replace(/-/g, ' ')}
        </motion.span>
        <motion.h3
          variants={{ hover: { y: 0, opacity: 1 } }}
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}
        >
          {item.title}
        </motion.h3>
      </motion.div>
    </motion.div>
  );
}
