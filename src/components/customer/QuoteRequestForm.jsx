import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUpload } from '../../hooks/useStorage';
import Button from '../ui/Button';
import useAuthStore from '../../store/useAuthStore';
import { SERVICES, BUDGET_OPTIONS } from '../../lib/constants';

const schema = z.object({
  serviceType: z.string().min(1, 'Hizmet seçin'),
  projectDescription: z.string().min(20, 'En az 20 karakter girin'),
  budget: z.string().min(1, 'Bütçe seçin'),
  phone: z.string().optional(),
});

const STEPS = ['Hizmet', 'Proje Detayları', 'Bütçe & Tarih', 'Dosyalar'];

export default function QuoteRequestForm({ onSuccess }) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuthStore();
  const { upload, uploading, progress } = useUpload();

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { serviceType: '', projectDescription: '', budget: '' },
  });

  const STEP_FIELDS = [['serviceType'], ['projectDescription'], ['budget'], []];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (accepted) => setFiles((f) => [...f, ...accepted].slice(0, 5)),
  });

  const next = async () => {
    const fields = STEP_FIELDS[step];
    if (fields.length) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data) => {
    try {
      let attachments = [];
      if (files.length) {
        for (const f of files) {
          const url = await upload(f, `quotes/${user.uid}`);
          attachments.push(url);
        }
      }
      await addDoc(collection(db, 'quotes'), {
        ...data, userId: user.uid, userName: user.displayName || '',
        userEmail: user.email, attachments,
        status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success('Teklif talebiniz alındı!');
      onSuccess?.();
    } catch {
      toast.error('Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem' }}>
        <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Talebiniz Alındı!</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>En kısa sürede size dönüş yapacağız.</p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i <= step ? 'var(--color-primary)' : 'var(--glass-bg)',
              border: '1px solid ' + (i <= step ? 'var(--color-primary)' : 'var(--glass-border)'),
              color: i <= step ? '#000' : 'var(--color-text-muted)',
              fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.3s ease', flexShrink: 0,
            }}>{i + 1}</div>
            <span style={{ fontSize: '0.8rem', color: i === step ? 'var(--color-text-primary)' : 'var(--color-text-muted)', display: 'none' }}>{s}</span>
            {i < STEPS.length - 1 && <div style={{ width: '2rem', height: '1px', background: i < step ? 'var(--color-primary)' : 'var(--glass-border)', transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            {step === 0 && (
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Hangi hizmete ihtiyacınız var?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SERVICES.map((svc) => (
                    <label key={svc.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', borderRadius: '12px', border: '1px solid ' + (watch('serviceType') === svc.id ? 'var(--color-primary)' : 'var(--glass-border)'), background: watch('serviceType') === svc.id ? 'rgba(200,164,92,0.05)' : 'var(--glass-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input type="radio" value={svc.id} {...register('serviceType')} style={{ display: 'none' }} />
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{svc.label}</span>
                    </label>
                  ))}
                </div>
                {errors.serviceType && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{errors.serviceType.message}</p>}
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Projenizi anlatın</h3>
                <div className="floating-label-group">
                  <textarea placeholder=" " rows={6} {...register('projectDescription')} />
                  <label>Proje Açıklaması</label>
                  <span className="floating-underline" />
                  {errors.projectDescription && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.projectDescription.message}</p>}
                </div>
                <div className="floating-label-group" style={{ marginTop: '1.5rem' }}>
                  <input type="tel" placeholder=" " {...register('phone')} />
                  <label>Telefon Numaranız</label>
                  <span className="floating-underline" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Bütçe aralığınız?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {BUDGET_OPTIONS.map((opt) => (
                    <label key={opt.value} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', borderRadius: '12px', border: '1px solid ' + (watch('budget') === opt.value ? 'var(--color-primary)' : 'var(--glass-border)'), background: watch('budget') === opt.value ? 'rgba(200,164,92,0.05)' : 'var(--glass-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input type="radio" value={opt.value} {...register('budget')} style={{ display: 'none' }} />
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.budget && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{errors.budget.message}</p>}
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Referans görseller (opsiyonel)</h3>
                <div {...getRootProps()} style={{ border: '2px dashed var(--glass-border)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', background: isDragActive ? 'rgba(200,164,92,0.05)' : 'var(--glass-bg)', borderColor: isDragActive ? 'var(--color-primary)' : 'var(--glass-border)' }}>
                  <input {...getInputProps()} />
                  <Upload size={32} style={{ color: 'var(--color-primary)', margin: '0 auto 0.75rem' }} />
                  <p style={{ color: 'var(--color-text-secondary)' }}>{isDragActive ? 'Bırakın!' : 'Sürükleyin veya tıklayın (max 5 dosya)'}</p>
                </div>
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    {files.map((f, i) => (
                      <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={URL.createObjectURL(f)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {uploading && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--color-primary)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>Yükleniyor... {Math.round(progress)}%</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 0 && (
            <button type="button" onClick={prev} className="btn-ghost" style={{ padding: '10px 24px' }}>
              <ChevronLeft size={16} /> Geri
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={next} className="btn-primary" style={{ padding: '10px 24px', marginLeft: 'auto' }}>
              İleri <ChevronRight size={16} />
            </button>
          ) : (
            <Button type="submit" loading={uploading || isSubmitting} variant="primary" style={{ marginLeft: 'auto' }}>
              Talebi Gönder
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
