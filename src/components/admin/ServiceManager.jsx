import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useCollection, addDocument, updateDocument, deleteDocument, orderBy } from '../../hooks/useFirestore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ServiceManager() {
  const { data: services } = useCollection('services', [orderBy('order', 'asc')]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', longDescription: '', icon: 'camera', features: '', order: 1, isActive: true });

  const openNew = () => { setEditing(null); setForm({ title: '', description: '', longDescription: '', icon: 'camera', features: '', order: (services?.length || 0) + 1, isActive: true }); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s, features: s.features?.join(', ') || '' }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title) { toast.error('Başlık zorunlu'); return; }
    const data = { ...form, features: form.features.split(',').map((f) => f.trim()).filter(Boolean), order: Number(form.order) };
    if (editing) await updateDocument('services', editing.id, data);
    else await addDocument('services', data);
    toast.success(editing ? 'Güncellendi' : 'Eklendi');
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await deleteDocument('services', id);
    toast.success('Silindi');
  };

  const toggleActive = async (svc) => {
    await updateDocument('services', svc.id, { isActive: !svc.isActive });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Hizmet Yönetimi</h1>
        <Button onClick={openNew} icon={<Plus size={16} />} variant="primary">Yeni Hizmet</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {services?.map((svc) => (
          <motion.div key={svc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', opacity: svc.isActive ? 1 : 0.5 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{svc.title}</p>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>{svc.description?.slice(0, 80)}...</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => openEdit(svc)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>Düzenle</button>
              <button onClick={() => toggleActive(svc)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: svc.isActive ? 'var(--color-success)' : 'var(--color-text-muted)', cursor: 'pointer' }}>
                {svc.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => handleDelete(svc.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Hizmet Düzenle' : 'Yeni Hizmet'} size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FloatInput label="Hizmet Adı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <FloatInput label="Kısa Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <FloatInput label="Uzun Açıklama" multiline value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} />
          <FloatInput label="Özellikler (virgülle ayır)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
          <FloatInput label="Sıra" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Aktif
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
      <Tag placeholder=" " rows={multiline ? 3 : undefined} {...rest} />
      <label>{label}</label>
      <span className="floating-underline" />
    </div>
  );
}
