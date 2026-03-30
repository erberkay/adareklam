import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, ImageIcon, FileText, Star } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useCollection } from '../../hooks/useFirestore';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { QUOTE_STATUSES } from '../../lib/constants';

export default function AdminDashboard() {
  const { data: quotes } = useCollection('quotes');
  const { data: portfolio } = useCollection('portfolio');
  const { data: users } = useCollection('users');
  const { data: testimonials } = useCollection('testimonials');
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const pending = quotes?.filter((q) => q.status === 'pending').length || 0;

  const stats = [
    { label: 'Toplam Kullanıcı', value: users?.length || 0, icon: Users, color: '#3b82f6' },
    { label: 'Portfolyo Öğesi', value: portfolio?.length || 0, icon: ImageIcon, color: '#c8a45c' },
    { label: 'Teklif Talebi', value: quotes?.length || 0, icon: FileText, color: '#22c55e' },
    { label: 'Referans', value: testimonials?.length || 0, icon: Star, color: '#f59e0b' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        {pending > 0 && <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{pending} bekleyen teklif talebi var. </span>}
        Hoş geldiniz!
      </p>

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}
      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={staggerItem} className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', borderRadius: '0 0 0 60px', background: `${s.color}15` }} />
            <s.icon size={22} style={{ color: s.color, marginBottom: '1rem' }} />
            <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--color-text-primary)' }}>
              <AnimatedCounter target={s.value} />
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent quotes */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>Son Teklif Talepleri</h2>
        {!quotes?.length ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Henüz teklif talebi yok.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {quotes.slice(0, 5).map((q) => {
              const s = QUOTE_STATUSES[q.status] || QUOTE_STATUSES.pending;
              return (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <div>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{q.userName || q.userEmail}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{q.serviceType?.replace(/-/g, ' ')}</p>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '50px', background: 'rgba(200,164,92,0.1)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
