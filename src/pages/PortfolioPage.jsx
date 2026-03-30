import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/layout/PageTransition';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import useSiteSettingsStore from '../store/useSiteSettingsStore';

export default function PortfolioPage() {
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);
  return (
    <PageTransition>
      <Helmet>
        <title>Portfolyo — {siteName}</title>
        <meta name="description" content="Çalışmalarımızı keşfedin. Ürün çekimi, mekan fotoğrafçılığı, reklam tasarımı ve daha fazlası." />
      </Helmet>

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
