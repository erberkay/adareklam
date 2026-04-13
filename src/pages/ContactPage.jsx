import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, AtSign, Share2, PlayCircle, MessageCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PageTransition from '../components/layout/PageTransition';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import Button from '../components/ui/Button';
import useSiteSettingsStore from '../store/useSiteSettingsStore';
import PageSEO from '../components/ui/PageSEO';

const BASE_URL = 'https://erberkay.github.io/adareklam';

const schema = z.object({
  name: z.string().min(2, 'En az 2 karakter girin'),
  email: z.string().email('Geçerli bir e-posta girin'),
  phone: z.string().optional(),
  message: z.string().min(10, 'En az 10 karakter girin'),
});

export default function ContactPage() {
  const settings = useSiteSettingsStore((s) => s.settings);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'contacts'), { ...data, isRead: false, createdAt: serverTimestamp() });
      setSent(true);
      reset();
      toast.success('Mesajınız iletildi!');
    } catch (err) {
      toast.error('Mesaj gönderilemedi: ' + err.message);
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BASE_URL + '/#organization',
    name: settings.siteName,
    url: BASE_URL,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Kuşadası',
      addressRegion: 'Aydın',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.856,
      longitude: 27.2636,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone,
      contactType: 'customer service',
      availableLanguage: 'Turkish',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  };

  return (
    <PageTransition>
      <PageSEO
        title="İletişim"
        description={`${settings.siteName} ile iletişime geçin. Kuşadası'nda profesyonel reklam ve fotoğraf hizmetleri için bize ulaşın.`}
        path="/iletisim"
        jsonLd={jsonLd}
      />

      <div style={{ paddingTop: '7rem', background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
        <section className="section-padding" style={{ paddingTop: '3rem' }}>
          <div className="container">
            <RevealOnScroll variant="fadeUp" style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <span className="section-label">İletişim</span>
              <h1 className="heading-section" style={{ marginTop: '0.75rem' }}>
                Birlikte <span className="gradient-text">Konuşalım</span>
              </h1>
            </RevealOnScroll>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
              {/* Contact Info */}
              <RevealOnScroll variant="fadeLeft">
                <div>
                  <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
                    İletişim Bilgileri
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {settings.phone && <ContactItem icon={<Phone size={18} />} label="Telefon" value={settings.phone} href={`tel:${settings.phone}`} />}
                    {settings.email && <ContactItem icon={<Mail size={18} />} label="E-posta" value={settings.email} href={`mailto:${settings.email}`} />}
                    {settings.address && <ContactItem icon={<MapPin size={18} />} label="Adres" value={settings.address} />}
                  </div>
                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                      Sosyal Medya
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {settings.socialMedia?.instagram && <SocialBtn href={settings.socialMedia.instagram} icon={<AtSign size={18} />} />}
                      {settings.socialMedia?.facebook && <SocialBtn href={settings.socialMedia.facebook} icon={<Share2 size={18} />} />}
                      {settings.socialMedia?.youtube && <SocialBtn href={settings.socialMedia.youtube} icon={<PlayCircle size={18} />} />}
                      {settings.socialMedia?.whatsapp && <SocialBtn href={`https://wa.me/${settings.socialMedia.whatsapp.replace(/\D/g, '')}`} icon={<MessageCircle size={18} />} />}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Form */}
              <RevealOnScroll variant="fadeRight">
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                  {sent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: 'center', padding: '2rem' }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                      >
                        <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto 1rem' }} />
                      </motion.div>
                      <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                        Mesajınız İletildi!
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                        En kısa sürede size dönüş yapacağız.
                      </p>
                      <button onClick={() => setSent(false)} className="btn-ghost">Yeni Mesaj</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                      <FloatInput label="Adınız Soyadınız" error={errors.name?.message} {...register('name')} />
                      <FloatInput label="E-posta Adresiniz" type="email" error={errors.email?.message} {...register('email')} />
                      <FloatInput label="Telefon (opsiyonel)" type="tel" {...register('phone')} />
                      <FloatInput label="Mesajınız" multiline rows={5} error={errors.message?.message} {...register('message')} />
                      <Button type="submit" loading={isSubmitting} variant="primary">
                        Mesaj Gönder
                      </Button>
                    </form>
                  )}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      </div>

      {/* Harita */}
      <section style={{ paddingBottom: '5rem', background: 'var(--color-bg-primary)' }}>
        <div className="container">
          <RevealOnScroll variant="fadeUp">
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <iframe
                title="Kuşadası Konum"
                src="https://www.openstreetmap.org/export/embed.html?bbox=27.2336%2C37.8460%2C27.2936%2C37.8660&layer=mapnik&marker=37.8560%2C27.2636"
                style={{ width: '100%', height: '400px', border: 0, display: 'block', filter: 'invert(1) hue-rotate(200deg) brightness(0.85)' }}
                loading="lazy"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </PageTransition>
  );
}

function ContactItem({ icon, label, value, href }) {
  const content = (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(200,164,92,0.1)', border: '1px solid rgba(200,164,92,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-primary)' }}>
        {icon}
      </div>
      <div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} style={{ textDecoration: 'none' }}>{content}</a> : content;
}

function SocialBtn({ href, icon }) {
  return (
    <motion.a
      href={href} target="_blank" rel="noopener noreferrer"
      whileHover={{ scale: 1.1, borderColor: 'var(--color-primary)' }}
      style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', transition: 'color 0.3s' }}
    >
      {icon}
    </motion.a>
  );
}

function FloatInput({ label, error, multiline, rows, ...rest }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="floating-label-group">
      <Tag placeholder=" " rows={multiline ? rows : undefined} {...rest} />
      <label>{label}</label>
      <span className="floating-underline" />
      {error && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}
