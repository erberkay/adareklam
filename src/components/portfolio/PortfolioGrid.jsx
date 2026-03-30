import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection, where } from '../../hooks/useFirestore';
import CategoryFilter from './CategoryFilter';
import PortfolioItem from './PortfolioItem';
import PortfolioLightbox from './PortfolioLightbox';
import { staggerContainer } from '../../lib/animations';
import { SkeletonCard } from '../ui/Skeleton';
import { useInView } from 'react-intersection-observer';

const DEMO_ITEMS = [
  { id: 1, title: 'Ürün Fotoğrafı Çekimi', category: 'urun-cekimi', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', isPublished: true },
  { id: 2, title: 'Lüks Mekan Çekimi', category: 'mekan-cekimi', thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', isPublished: true },
  { id: 3, title: 'Dijital Reklam', category: 'reklam', thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', isPublished: true },
  { id: 4, title: 'Instagram İçerik', category: 'sosyal-medya', thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80', isPublished: true },
  { id: 5, title: 'Kurumsal Web Site', category: 'web-tasarim', thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80', isPublished: true },
  { id: 6, title: 'Stüdyo Ürün', category: 'urun-cekimi', thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', isPublished: true },
  { id: 7, title: 'Restoran Çekimi', category: 'mekan-cekimi', thumbnail: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', isPublished: true },
  { id: 8, title: 'Outdoor Reklam', category: 'reklam', thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', isPublished: true },
];

export default function PortfolioGrid() {
  const [category, setCategory] = useState('tumu');
  const [lightboxItem, setLightboxItem] = useState(null);
  const { data: portfolio, loading } = useCollection('portfolio', [where('isPublished', '==', true)]);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const items = portfolio?.length ? portfolio : DEMO_ITEMS;

  const filtered = category === 'tumu' ? items : items.filter((i) => i.category === category);

  return (
    <>
      <CategoryFilter active={category} onChange={setCategory} />

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
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <PortfolioItem key={item.id} item={item} onClick={setLightboxItem} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <PortfolioLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
