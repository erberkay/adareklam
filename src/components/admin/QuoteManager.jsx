import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCollection, updateDocument, orderBy } from '../../hooks/useFirestore';
import { QUOTE_STATUSES, SERVICES } from '../../lib/constants';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function QuoteManager() {
  const { data: quotes, loading } = useCollection('quotes', [orderBy('createdAt', 'desc')]);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [filter, setFilter] = useState('all');

  const openQuote = (q) => {
    setSelected(q);
    setResponse(q.adminResponse || '');
    setPrice(q.quotedPrice || '');
    setStatus(q.status);
  };

  const handleUpdate = async () => {
    await updateDocument('quotes', selected.id, { status, adminResponse: response, quotedPrice: Number(price) || 0 });
    toast.success('Teklif güncellendi');
    setSelected(null);
  };

  const filtered = filter === 'all' ? quotes : quotes?.filter((q) => q.status === filter);

  const statusColors = { pending: '#f59e0b', reviewed: '#3b82f6', quoted: '#c8a45c', accepted: '#22c55e', rejected: '#ef4444' };

  return (
    <div>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Teklif Yönetimi</h1>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['all', ...Object.keys(QUOTE_STATUSES)].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 16px', borderRadius: '50px', border: '1px solid var(--glass-border)', background: filter === s ? 'var(--color-primary)' : 'var(--glass-bg)', color: filter === s ? '#000' : 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
            {s === 'all' ? 'Tümü' : QUOTE_STATUSES[s].label}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: 'var(--color-text-muted)' }}>Yükleniyor...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered?.map((q) => {
            const svcLabel = SERVICES.find((s) => s.id === q.serviceType)?.label || q.serviceType;
            const sc = statusColors[q.status] || '#f59e0b';
            return (
              <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer' }} onClick={() => openQuote(q)}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{q.userName || q.userEmail}</p>
                    <span style={{ padding: '2px 10px', borderRadius: '50px', background: `${sc}20`, color: sc, fontSize: '0.75rem', fontWeight: 600 }}>{QUOTE_STATUSES[q.status]?.label}</span>
                    {q.quotedPrice > 0 && <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>₺{q.quotedPrice.toLocaleString('tr-TR')}</span>}
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>{svcLabel} • {q.budget}</p>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', flexShrink: 0 }}>{q.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || ''}</p>
              </motion.div>
            );
          })}
          {!filtered?.length && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Bu filtrede teklif talebi yok.</p>}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Teklif Detayı" size="md">
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <InfoRow label="Müşteri" value={selected.userName || selected.userEmail} />
            <InfoRow label="E-posta" value={selected.userEmail} />
            {selected.userPhone && <InfoRow label="Telefon" value={selected.userPhone} />}
            <InfoRow label="Hizmet" value={SERVICES.find((s) => s.id === selected.serviceType)?.label || selected.serviceType} />
            <InfoRow label="Bütçe" value={selected.budget} />
            <InfoRow label="Açıklama" value={selected.projectDescription} />

            <div>
              <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Durum</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)', fontFamily: 'Inter, sans-serif' }}>
                {Object.entries(QUOTE_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            <div className="floating-label-group">
              <input type="number" placeholder=" " value={price} onChange={(e) => setPrice(e.target.value)} />
              <label>Teklif Fiyatı (₺)</label>
              <span className="floating-underline" />
            </div>

            <div className="floating-label-group">
              <textarea placeholder=" " rows={4} value={response} onChange={(e) => setResponse(e.target.value)} />
              <label>Müşteriye Yanıt</label>
              <span className="floating-underline" />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelected(null)} className="btn-ghost">İptal</button>
              <Button onClick={handleUpdate} variant="primary">Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
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
