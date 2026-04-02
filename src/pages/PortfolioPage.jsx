import PageTransition from '../components/layout/PageTransition';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import PageSEO from '../components/ui/PageSEO';

export default function PortfolioPage() {
  return (
    <PageTransition>
      <PageSEO
        title="Portfolyo"
        description="Çalışmalarımızı keşfedin. Ürün çekimi, mekan fotoğrafçılığı, reklam tasarımı ve daha fazlası."
        path="/portfolyo"
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
