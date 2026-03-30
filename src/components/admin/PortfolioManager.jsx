import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCollection, addDocument, updateDocument, deleteDocument } from '../../hooks/useFirestore';
import { useUpload } from '../../hooks/useStorage';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PORTFOLIO_CATEGORIES } from '../../lib/constants';

export default function PortfolioManager() {
  const { data: portfolio, loading } = useCollection('portfolio');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', client: '', isPublished: true, isFeatured: false });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const { upload, uploading, progress } = useUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (f) => setImages((prev) => [...prev, ...f].slice(0, 10)),
  });

  const openNew = () => { setEditing(null); setForm({ title: '', description: '', category: '', client: '', isPublished: true, isFeatured: false }); setImages([]); setExistingImages([]); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title: item.title, description: item.description || '', category: item.category, client: item.client || '', isPublished: item.isPublished, isFeatured: item.isFeatured || false }); setImages([]); setExistingImages(item.images || []); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.category) { toast.error('Başlık ve kategori zorunlu'); return; }
    let urls = [...existingImages];
    for (const f of images) {
      const url = await upload(f, 'portfolio');
      urls.push(url);
    }
    const thumbnail = urls[0] || '';
    const data = { ...form, images: urls, thumbnail };
    if (editing) await updateDocument('portfolio', editing.id, data);
    else await addDocument('portfolio', data);
    toast.success(editing ? 'Güncellendi!' : 'Eklendi!');
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await deleteDocument('portfolio', id);
    toast.success('Silindi');
  };

  const togglePublish = async (item) => {
    await updateDocument('portfolio', item.id, { isPublished: !item.isPublished });
    toast.success(item.isPublished ? 'Yayından alındı' : 'Yayınlandı');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Portfolyo Yönetimi</h1>
        <Button onClick={openNew} icon={<Plus size={16} />} variant="primary">Yeni Ekle</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {portfolio?.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', aspectRatio: '4/3' }}>
              {item.thumbnail && <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              {!item.isPublished && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>Yayında Değil</span></div>}
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</p>
              <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>{item.category?.replace(/-/g, ' ')}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={() => openEdit(item)} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>Düzenle</button>
                <button onClick={() => togglePublish(item)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: item.isPublished ? 'var(--color-success)' : 'var(--color-text-muted)', cursor: 'pointer' }}>
                  {item.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Portfolyo Düzenle' : 'Yeni Portfolyo Öğesi'} size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="floating-label-group"><input placeholder=" " value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><label>Başlık</label><span className="floating-underline" /></div>
          <div className="floating-label-group"><input placeholder=" " value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /><label>Müşteri</label><span className="floating-underline" /></div>
          <div className="floating-label-group"><textarea placeholder=" " rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><label>Açıklama</label><span className="floating-underline" /></div>
          <div>
            <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Kategori</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)', fontFamily: 'Inter, sans-serif' }}>
              <option value="">Seçin</option>
              {PORTFOLIO_CATEGORIES.slice(1).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              Yayınla
            </label>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Öne Çıkar
            </label>
          </div>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {existingImages.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setExistingImages((imgs) => imgs.filter((_, j) => j !== i))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload zone */}
          <div {...getRootProps()} style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderColor: isDragActive ? 'var(--color-primary)' : 'var(--glass-border)', background: isDragActive ? 'rgba(200,164,92,0.05)' : 'var(--glass-bg)' }}>
            <input {...getInputProps()} />
            <Upload size={24} style={{ color: 'var(--color-primary)', margin: '0 auto 0.5rem' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Fotoğraf ekleyin (max 10)</p>
            {images.length > 0 && <p style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{images.length} dosya seçildi</p>}
          </div>

          {uploading && (
            <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--color-primary)', width: `${progress}%`, transition: 'width 0.3s' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setModalOpen(false)} className="btn-ghost">İptal</button>
            <Button onClick={handleSave} loading={uploading} variant="primary">Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
