import { Helmet } from 'react-helmet-async';
import { Camera, Megaphone, Globe, AtSign, Package, Clapperboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import useSiteSettingsStore from '../store/useSiteSettingsStore';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const SERVICES = [
  {
    icon: Camera, title: 'Profesyonel Fotoğraf Çekimi',
    desc: 'Düğün, moda, portre veya kurumsal fotoğraf çekimlerinde yaratıcı vizyon ve teknik mükemmellik bir araya geliyor.',
    features: ['Stüdyo Çekimi', 'Doğal Işık', 'Mekan Fotoğrafçılığı', 'Hızlı Teslimat'],
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
  },
  {
    icon: Package, title: 'Ürün Fotoğraf Çekimi',
    desc: 'E-ticaret, katalog ve reklam için beyaz fon, yaratıcı konsept ve lifestyle ürün fotoğrafçılığı.',
    features: ['Beyaz Fon Çekimi', 'Lifestyle Ürün', 'Katalog Fotoğrafçılığı', 'Ürün Rötuşu'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
  {
    icon: Globe, title: 'Web Sitesi Yapımı',
    desc: 'Modern, hızlı ve mobil uyumlu web siteleriyle dijital varlığınızı güçlendirin.',
    features: ['Responsive Tasarım', 'SEO Uyumlu', 'CMS Entegrasyonu', 'Hızlı Yükleme'],
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
  },
  {
    icon: Megaphone, title: 'İşletme Reklam İletişimi',
    desc: 'Google Ads, Meta Ads ve yerel reklam stratejileriyle işletmenizi doğru kitleye ulaştırın.',
    features: ['Google Ads', 'Meta Reklam', 'Hedef Kitle Analizi', 'Performans Takibi'],
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
  },
  {
    icon: AtSign, title: 'Instagram Yönetimi',
    desc: 'İçerik üretimi, planlama ve etkileşim yönetimiyle sosyal medya profilinizi büyütün.',
    features: ['İçerik Takvimi', 'Reels Üretimi', 'Hashtag Stratejisi', 'Analitik Raporlama'],
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
  },
  {
    icon: Clapperboard, title: 'Video Prodüksiyon',
    desc: 'Tanıtım filmleri, reels içerikler ve kurumsal video çözümleriyle markanızı harekete geçirin.',
    features: ['Tanıtım Filmi', 'Reels & TikTok', 'Kurumsal Video', 'Renk Düzeltme'],
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
  },
];

export default function ServicesPage() {
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);
  const { user } = useAuthStore();

  return (
    <PageTransition>
      <Helmet>
        <title>Hizmetler — {siteName}</title>
        <meta name="description" content="Profesyonel fotoğraf çekimi, web tasarımı, reklam ve sosyal medya yönetimi hizmetlerimizi keşfedin." />
      </Helmet>

      <div style={{ paddingTop: '7rem', background: 'var(--color-bg-primary)' }}>
        {/* Hero */}
        <section className="section-padding" style={{ paddingTop: '3rem' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <RevealOnScroll variant="clipReveal"><span className="section-label">Hizmetlerimiz</span></RevealOnScroll>
            <RevealOnScroll variant="fadeUp" delay={0.1}>
              <h1 className="heading-section" style={{ marginTop: '0.75rem' }}>
                Markanız İçin<br /><span className="gradient-text">Kapsamlı Çözümler</span>
              </h1>
            </RevealOnScroll>
            <RevealOnScroll variant="fadeUp" delay={0.2}>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '1.25rem', lineHeight: 1.7 }}>
                Fotoğrafçılıktan dijital pazarlamaya kadar markanızın ihtiyaç duyduğu tüm kreatif hizmetleri sunuyoruz.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* Services list */}
        {SERVICES.map((svc, i) => (
          <ServiceRow key={i} service={svc} index={i} user={user} />
        ))}
      </div>
    </PageTransition>
  );
}

function ServiceRow({ service: svc, index, user }) {
  const isOdd = index % 2 !== 0;
  const Icon = svc.icon;

  return (
    <section className="section-padding" style={{ background: index % 2 === 0 ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem', alignItems: 'center',
          flexDirection: isOdd ? 'row-reverse' : 'row',
        }}>
          <RevealOnScroll variant={isOdd ? 'fadeRight' : 'fadeLeft'}>
            <div style={{ order: isOdd ? 2 : 1 }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                background: 'rgba(200,164,92,0.1)', border: '1px solid rgba(200,164,92,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
              }}>
                <Icon size={26} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                {svc.title}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{svc.desc}</p>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {svc.features.map((f) => (
                  <li key={f} style={{
                    padding: '4px 12px', borderRadius: '50px',
                    background: 'rgba(200,164,92,0.1)', border: '1px solid rgba(200,164,92,0.2)',
                    color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 500, listStyle: 'none',
                  }}>{f}</li>
                ))}
              </ul>
              <Link
                to={user ? '/musteri' : '/giris'}
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex' }}
              >
                Teklif Al <ArrowRight size={16} />
              </Link>
            </div>
          </RevealOnScroll>
          <RevealOnScroll variant={isOdd ? 'fadeLeft' : 'fadeRight'}>
            <div style={{ order: isOdd ? 1 : 2, borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <motion.img
                src={svc.image}
                alt={svc.title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
