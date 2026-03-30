import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock } from 'lucide-react';
import { useCollection, where, orderBy } from '../../hooks/useFirestore';
import useAuthStore from '../../store/useAuthStore';
import { QUOTE_STATUSES, SERVICES } from '../../lib/constants';
import { Skeleton } from '../ui/Skeleton';

export default function MyQuotes() {
  const { user } = useAuthStore();
  const { data: quotes, loading } = useCollection('quotes', [where('userId', '==', user?.uid || ''), orderBy('createdAt', 'desc')]);
  const [expanded, setExpanded] = useState(null);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[...Array(3)].map((_, i) => <Skeleton key={i} height="80px" />)}
    </div>
  );

  if (!quotes?.length) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
      <Clock size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
      <p>Henüz teklif talebiniz bulunmuyor.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {quotes.map((q) => {
        const status = QUOTE_STATUSES[q.status] || QUOTE_STATUSES.pending;
        const svcLabel = SERVICES.find((s) => s.id === q.serviceType)?.label || q.serviceType;
        const isOpen = expanded === q.id;

        return (
          <motion.div key={q.id} layout className="glass-card" style={{ overflow: 'hidden' }}>
            <button
              onClick={() => setExpanded(isOpen ? null : q.id)}
              style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{svcLabel}</span>
                  <StatusBadge status={q.status} label={status.label} color={status.color} />
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                  {q.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || '—'}
                </p>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <InfoRow label="Proje Açıklaması" value={q.projectDescription} />
                      <InfoRow label="Bütçe" value={q.budget} />
                      {q.quotedPrice > 0 && <InfoRow label="Teklif Fiyatı" value={`₺${q.quotedPrice.toLocaleString('tr-TR')}`} />}
                      {q.adminResponse && (
                        <div style={{ padding: '1rem', background: 'rgba(200,164,92,0.05)', border: '1px solid rgba(200,164,92,0.2)', borderRadius: '10px' }}>
                          <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Ajans Yanıtı</p>
                          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{q.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status, label, color }) {
  const colors = {
    warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6' },
    primary: { bg: 'rgba(200,164,92,0.15)', border: 'rgba(200,164,92,0.3)', text: 'var(--color-primary)' },
    success: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' },
    error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
  };
  const c = colors[color] || colors.warning;
  return (
    <motion.span
      animate={status === 'pending' ? { opacity: [1, 0.5, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ padding: '2px 10px', borderRadius: '50px', background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontSize: '0.75rem', fontWeight: 600 }}
    >
      {label}
    </motion.span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>{label}</p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{value}</p>
    </div>
  );
}
