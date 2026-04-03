import PageTransition from '../components/layout/PageTransition';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import PageSEO from '../components/ui/PageSEO';
import useSiteSettingsStore from '../store/useSiteSettingsStore';

const BASE_URL = 'https://erberkay.github.io/adareklam';

export default function PortfolioPage() {
  const settings = useSiteSettingsStore((s) => s.settings);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${settings.siteName} Portfolyo`,
    description: 'Profesyonel fotoğraf çekimi, reklam tasarımı ve dijital medya çalışmalarımız.',
    url: BASE_URL + '/portfolyo',
    isPartOf: {
      '@type': 'WebSite',
      url: BASE_URL,
      name: settings.siteName,
    },
    provider: {
      '@type': 'LocalBusiness',
      name: settings.siteName,
      url: BASE_URL,
    },
  };

  return (
    <PageTransition>
      <PageSEO
        title="Portfolyo"
        description="Çalışmalarımızı keşfedin. Ürün çekimi, mekan fotoğrafçılığı, reklam tasarımı ve daha fazlası."
        path="/portfolyo"
        jsonLd={jsonLd}
      />

      <section style={{ paddingTop: '8rem', background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
        <div className="container">
          <RevealOnScroll variant="clipReveal" style={{ marginBottom: '0.75rem' }}>
            <span className="section-label">Portfolyo</span>
          </RevealOnScroll>
          <RevealOnScroll variant="fadeUp" style={{ marginBottom: '3rem' }}>
            <h1 className="heading-section">
              Tüm <span className="gradient-text">Çalışmalarımız</span>
            </h1>
          </RevealOnScroll>
          <PortfolioGrid />
        </div>
      </section>
    </PageTransition>
  );
}
