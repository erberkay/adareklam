import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/layout/PageTransition';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import StatsSection from '../components/home/StatsSection';
import CTASection from '../components/home/CTASection';
import useSiteSettingsStore from '../store/useSiteSettingsStore';

export default function AboutPage() {
  const settings = useSiteSettingsStore((s) => s.settings);
  return (
    <PageTransition>
      <Helmet>
        <title>Hakkımızda — {settings.siteName}</title>
        <meta name="description" content={`${settings.siteName} hakkında bilgi edinin.`} />
      </Helmet>

      <div style={{ paddingTop: '7rem', background: 'var(--color-bg-primary)' }}>
        {/* Hero */}
        <section className="section-padding" style={{ paddingTop: '3rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div>
                <RevealOnScroll variant="clipReveal"><span className="section-label">Hakkımızda</span></RevealOnScroll>
                <RevealOnScroll variant="fadeUp" delay={0.1}>
                  <h1 className="heading-section" style={{ marginTop: '0.75rem' }}>
                    Kuşadası'nın <br /><span className="gradient-text">Kreatif Sesi</span>
                  </h1>
                </RevealOnScroll>
                {settings.aboutText && settings.aboutText.split('\n').map((para, i) => (
                  <RevealOnScroll key={i} variant="fadeUp" delay={0.2 + i * 0.1}>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: '1rem' }}>{para}</p>
                  </RevealOnScroll>
                ))}
                {!settings.aboutText && (
                  <RevealOnScroll variant="fadeUp" delay={0.2}>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: '1rem' }}>
                      {settings.siteName} olarak Kuşadası'nda kurulduğumuz günden bu yana, küçük işletmelerden büyük markalara kadar yüzlerce müşterimize profesyonel reklam ve fotoğraf hizmetleri sunduk.
                    </p>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: '1rem' }}>
                      Fotoğrafçılığa olan tutkumuz, dijital dünyanın dinamiklerini anlama kapasitemizle birleşince ortaya sadece görsel değil, marka değeri yaratan çalışmalar çıkıyor.
                    </p>
                  </RevealOnScroll>
                )}
              </div>
              <RevealOnScroll variant="scaleUp">
                <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/5', position: 'relative' }}>
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                    alt="Ekibimiz"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem',
                    background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)',
                    borderRadius: '16px', padding: '1.25rem',
                    border: '1px solid var(--glass-border)',
                  }}>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--color-text-primary)' }}>{settings.siteName}</p>
                    <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>{settings.tagline}</p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <StatsSection />
        <CTASection />
      </div>
    </PageTransition>
  );
}
