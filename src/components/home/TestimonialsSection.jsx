import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import RevealOnScroll from '../ui/RevealOnScroll';
import { useCollection } from '../../hooks/useFirestore';
import { useIsMobile } from '../../hooks/useMediaQuery';

const DEMO_TESTIMONIALS = [
  { id: 1, clientName: 'Ayşe Yılmaz', company: 'Yılmaz Butik', rating: 5, text: 'Ada Reklamcılık ile çalışmak harika bir deneyimdi. Ürün fotoğraflarımız satışlarımızı %40 artırdı!', photoURL: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, clientName: 'Mehmet Kaya', company: 'Kaya Restaurant', rating: 5, text: 'Restoranımız için hazırladıkları tanıtım filmi ve sosyal medya içerikleri gerçekten çok profesyoneldi.', photoURL: 'https://i.pravatar.cc/100?img=8' },
  { id: 3, clientName: 'Zeynep Demir', company: 'Demir Hukuk Bürosu', rating: 5, text: 'Web sitemizi modern ve çarpıcı bir görünüme kavuşturan Ada Reklamcılık\'a teşekkürler.', photoURL: 'https://i.pravatar.cc/100?img=5' },
  { id: 4, clientName: 'Can Öztürk', company: 'Öztürk Otelcilik', rating: 5, text: 'Kuşadası\'nda bu kalitede reklam ajansı bulmak gerçekten güzdü. Kesinlikle tavsiye ediyorum.', photoURL: 'https://i.pravatar.cc/100?img=3' },
];

export default function TestimonialsSection() {
  const isMobile = useIsMobile();
  const { data: firestoreItems, loading } = useCollection('testimonials');
  const published = firestoreItems?.filter((t) => t.isPublished !== false) || [];
  const items = loading ? [] : (published.length ? published : DEMO_TESTIMONIALS);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000 })]
  );

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slideWidth = isMobile ? '88%' : 'calc(33.333% - 1rem)';

  return (
    <section className="section-padding" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <RevealOnScroll variant="fadeUp" style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3.5rem' }}>
          <span className="section-label">Müşteri Yorumları</span>
          <h2 className="heading-section" style={{ marginTop: '0.75rem', color: 'var(--color-text-primary)' }}>
            Memnun Müşterilerimiz<br /><span className="gradient-text">Ne Diyor?</span>
          </h2>
        </RevealOnScroll>

        <div style={{ position: 'relative', padding: isMobile ? '0 2rem' : '0 2.5rem' }}>
          <div ref={emblaRef} style={{ overflow: 'hidden', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: isMobile ? '1rem' : '1.5rem' }}>
              {items.map((t) => (
                <div
                  key={t.id}
                  style={{ flex: `0 0 ${slideWidth}`, minWidth: 0 }}
                >
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={prev} style={arrowStyle('left')}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} style={arrowStyle('right')}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial: t }) {
  return (
    <div className="glass-card" style={{ padding: '2rem', height: '100%' }}>
      <Quote size={28} style={{ color: 'var(--color-primary)', opacity: 0.5, marginBottom: '1rem' }} />
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem', fontStyle: 'italic' }}>
        "{t.text}"
      </p>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
        {[...Array(t.rating || 5)].map((_, i) => (
          <Star key={i} size={14} style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {t.photoURL && (
          <img src={t.photoURL} alt={t.clientName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
        )}
        <div>
          <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{t.clientName}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t.company}</p>
        </div>
      </div>
    </div>
  );
}

function arrowStyle(side) {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: '0',
    background: 'var(--color-bg-card)', border: '1px solid var(--glass-border)',
    borderRadius: '50%', width: '40px', height: '40px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--color-text-primary)',
    transition: 'all 0.2s ease', zIndex: 5,
  };
}
