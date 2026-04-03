import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { X, Plus, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import { useUpload } from '../../hooks/useStorage';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';

export default function SiteSettings() {
  const { settings } = useSiteSettingsStore();
  const { upload: uploadLogo, uploading: logoUploading } = useUpload();
  const { upload: uploadHero, uploading: heroUploading } = useUpload();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [brands, setBrands] = useState(settings.brands || []);
  const [logoRadius, setLogoRadius] = useState(settings.logoRadius ?? 0);
  const brandInputRef = useRef(null);

  useEffect(() => {
    setBrands(settings.brands || []);
  }, [settings.brands]);

  useEffect(() => {
    setLogoRadius(settings.logoRadius ?? 0);
  }, [settings.logoRadius]);

  useEffect(() => {
    if (settings) reset({ ...settings, ...settings.socialMedia, ...settings.stats });
  }, [settings, reset]);

  const addBrand = () => {
    const val = brandInputRef.current?.value?.trim();
    if (!val) return;
    setBrands((prev) => [...prev, val]);
    brandInputRef.current.value = '';
  };

  const removeBrand = (i) => setBrands((prev) => prev.filter((_, idx) => idx !== i));

  const onSubmit = async (data) => {
    try {
      const payload = {
        siteName: data.siteName, tagline: data.tagline, heroSubtitle: data.heroSubtitle || '',
        phone: data.phone, email: data.email, address: data.address, aboutText: data.aboutText,
        primaryColor: data.primaryColor,
        heroVideo: data.heroVideo || '',
        logoRadius: Number(logoRadius),
        brands,
        socialMedia: { instagram: data.instagram || '', facebook: data.facebook || '', youtube: data.youtube || '', whatsapp: data.whatsapp || '' },
        stats: { projectCount: Number(data.projectCount) || 0, clientCount: Number(data.clientCount) || 0, yearExperience: Number(data.yearExperience) || 0, photoCount: Number(data.photoCount) || 0 },
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'siteSettings', 'config'), payload, { merge: true });
      toast.success('Site ayarları kaydedildi!');
    } catch (err) {
      toast.error('Kaydedilemedi: ' + err.message);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadLogo(file, 'site');
      await setDoc(doc(db, 'siteSettings', 'config'), { logo: url }, { merge: true });
      toast.success('Logo yüklendi!');
    } catch (err) {
      toast.error('Logo yüklenemedi: ' + err.message);
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadHero(file, 'site');
      await setDoc(doc(db, 'siteSettings', 'config'), { heroImage: url }, { merge: true });
      toast.success('Hero görseli yüklendi!');
    } catch (err) {
      toast.error('Görsel yüklenemedi: ' + err.message);
    }
  };

  const handleHeroReset = async () => {
    try {
      await setDoc(doc(db, 'siteSettings', 'config'), { heroImage: '' }, { merge: true });
      toast.success('Hero görseli kaldırıldı!');
    } catch (err) {
      toast.error('İşlem başarısız: ' + err.message);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '2rem' }}>Site Ayarları</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Genel */}
          <Section title="Genel Bilgiler">
            <FormRow label="Site Adı" name="siteName" register={register} />
            <FormRow label="Tagline" name="tagline" register={register} />
            <FormRow label="Hero Alt Yazısı" name="heroSubtitle" register={register} multiline />
            <FormRow label="Hakkımızda Metni" name="aboutText" register={register} multiline />
          </Section>

          {/* Tema */}
          <Section title="Tema Rengi">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="color" {...register('primaryColor')} style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'none', cursor: 'pointer' }} />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Ana rengi seçin (site genelinde uygulanır)</span>
            </div>
          </Section>

          {/* İletişim */}
          <Section title="İletişim Bilgileri">
            <FormRow label="Telefon" name="phone" register={register} />
            <FormRow label="E-posta" name="email" type="email" register={register} />
            <FormRow label="Adres" name="address" register={register} />
          </Section>

          {/* Sosyal Medya */}
          <Section title="Sosyal Medya">
            <FormRow label="Instagram URL" name="instagram" register={register} />
            <FormRow label="Facebook URL" name="facebook" register={register} />
            <FormRow label="YouTube URL" name="youtube" register={register} />
            <FormRow label="WhatsApp Numarası (+905...)" name="whatsapp" register={register} />
          </Section>

          {/* İstatistikler */}
          <Section title="Ana Sayfa İstatistikleri">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              <FormRow label="Proje Sayısı" name="projectCount" type="number" register={register} />
              <FormRow label="Müşteri Sayısı" name="clientCount" type="number" register={register} />
              <FormRow label="Yıl Deneyim" name="yearExperience" type="number" register={register} />
              <FormRow label="Fotoğraf Sayısı" name="photoCount" type="number" register={register} />
            </div>
          </Section>

          {/* Markalar */}
          <Section title="Birlikte Çalışılan Markalar">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {brands.map((b, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(200,164,92,0.1)', border: '1px solid rgba(200,164,92,0.25)', borderRadius: '50px', padding: '4px 12px', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                  {b}
                  <button type="button" onClick={() => removeBrand(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {brands.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Henüz marka eklenmedi</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                ref={brandInputRef}
                type="text"
                placeholder="Marka adı girin"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBrand())}
                style={{ flex: 1, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '10px 14px', color: 'var(--color-text-primary)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none' }}
              />
              <button type="button" onClick={addBrand} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                <Plus size={16} /> Ekle
              </button>
            </div>
          </Section>

          {/* Video */}
          <Section title="Hero Video (opsiyonel)">
            <FormRow label="Video URL (mp4, webm)" name="heroVideo" register={register} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '-0.5rem' }}>Video URL girilirse ana sayfada resim yerine video gösterilir.</p>
          </Section>

          {/* Görseller */}
          <Section title="Görseller">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Logo</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'var(--color-text-secondary)', cursor: logoUploading ? 'not-allowed' : 'pointer', fontSize: '0.85rem', opacity: logoUploading ? 0.6 : 1 }}>
                  {logoUploading ? 'Yükleniyor…' : 'Yükle'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} disabled={logoUploading} />
                </label>
                {settings.logo && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <img
                      src={settings.logo}
                      alt="Logo"
                      style={{ height: '48px', maxWidth: '160px', objectFit: 'contain', display: 'block', borderRadius: logoRadius + '%', background: 'rgba(255,255,255,0.05)', padding: '4px' }}
                    />
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', marginTop: '0.4rem' }}>Önizleme (Navbar/Footer)</p>
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Logo Köşe Yuvarlama</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Köşeli</span>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={logoRadius}
                    onChange={(e) => setLogoRadius(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Yuvarlak</span>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', marginTop: '0.4rem' }}>{logoRadius}% — {logoRadius === 50 ? 'Tam daire' : logoRadius === 0 ? 'Köşeli' : 'Hafif yuvarlak'}</p>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Hero Görseli</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'var(--color-text-secondary)', cursor: heroUploading ? 'not-allowed' : 'pointer', fontSize: '0.85rem', opacity: heroUploading ? 0.6 : 1 }}>
                  {heroUploading ? 'Yükleniyor…' : 'Yükle'}
                  <input type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: 'none' }} disabled={heroUploading} />
                </label>
                {settings.heroImage && (
                  <>
                    <img src={settings.heroImage} alt="Hero" style={{ height: '60px', marginTop: '0.5rem', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
                    <button type="button" onClick={handleHeroReset} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.5)', color: 'rgb(239,68,68)', background: 'transparent', cursor: 'pointer', fontSize: '0.78rem', marginTop: '0.5rem' }}>
                      <RotateCcw size={12} /> Kaldır
                    </button>
                  </>
                )}
              </div>
            </div>
          </Section>

          <Button type="submit" loading={isSubmitting} variant="primary">
            Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>{children}</div>
    </div>
  );
}

function FormRow({ label, name, register, type = 'text', multiline }) {
  return (
    <div className="floating-label-group">
      {multiline ? <textarea placeholder=" " rows={4} {...register(name)} /> : <input type={type} placeholder=" " {...register(name)} />}
      <label>{label}</label>
      <span className="floating-underline" />
    </div>
  );
}
