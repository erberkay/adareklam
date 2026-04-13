import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCollection, addDocument, updateDocument, deleteDocument } from '../../hooks/useFirestore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function TestimonialManager() {
  const { data: testimonials } = useCollection('testimonials');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ clientName: '', company: '', text: '', rating: 5, isPublished: true });

  const openNew = () => { setEditing(null); setForm({ clientName: '', company: '', text: '', rating: 5, isPublished: true }); setModalOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm(t); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.clientName || !form.text) { toast.error('İsim ve yorum zorunlu'); return; }
    try {
      if (editing) await updateDocument('testimonials', editing.id, form);
      else await addDocument('testimonials', form);
      toast.success(editing ? 'Güncellendi' : 'Eklendi');
      setModalOpen(false);
    } catch (err) {
      toast.error('Kaydedilemedi: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      await deleteDocument('testimonials', id);
      toast.success('Silindi');
    } catch (err) {
      toast.error('Silinemedi: ' + err.message);
    }
  };

  const togglePublish = async (t) => {
    try {
      await updateDocument('testimonials', t.id, { isPublished: !t.isPublished });
    } catch (err) {
      toast.error('Güncellenemedi: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Referans Yönetimi</h1>
        <Button onClick={openNew} icon={<Plus size={16} />} variant="primary">Yeni Ekle</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {testimonials?.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '4px' }}>
                <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{t.clientName}</p>
                {t.company && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>— {t.company}</span>}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={12} style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }} />)}
                </div>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>"{t.text?.slice(0, 100)}{t.text?.length > 100 ? '...' : ''}"</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => openEdit(t)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>Düzenle</button>
              <button onClick={() => togglePublish(t)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: t.isPublished ? 'var(--color-success)' : 'var(--color-text-muted)', cursor: 'pointer' }}>
                {t.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => handleDelete(t.id)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Referans Düzenle' : 'Yeni Referans'} size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FloatInput label="Müşteri Adı" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          <FloatInput label="Şirket / Unvan" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <FloatInput label="Yorum" multiline value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <div>
            <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Puan: {form.rating} / 5</label>
            <input type="range" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-primary)', marginTop: '0.5rem' }} />
          </div>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Yayınla
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setModalOpen(false)} className="btn-ghost">İptal</button>
            <Button onClick={handleSave} variant="primary">Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FloatInput({ label, multiline, ...rest }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="floating-label-group">
      <Tag placeholder=" " rows={multiline ? 4 : undefined} {...rest} />
      <label>{label}</label>
      <span className="floating-underline" />
    </div>
  );
}
