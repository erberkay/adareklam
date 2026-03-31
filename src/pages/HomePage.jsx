import { HelmetProvider, Helmet } from 'react-helmet-async';
import PageTransition from '../components/layout/PageTransition';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import StatsSection from '../components/home/StatsSection';
import PortfolioPreview from '../components/home/PortfolioPreview';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BrandsSection from '../components/home/BrandsSection';
import CTASection from '../components/home/CTASection';
import useSiteSettingsStore from '../store/useSiteSettingsStore';

export default function HomePage() {
  const settings = useSiteSettingsStore((s) => s.settings);
  const siteName = settings.siteName;
  const desc = "Kuşadası'nın önde gelen reklam ve fotoğraf ajansı. Profesyonel fotoğraf çekimi, web tasarımı ve sosyal medya yönetimi.";
  return (
    <PageTransition>
      <Helmet>
        <title>{siteName} — Kuşadası Reklam & Fotoğraf Ajansı</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={`${siteName} — Kuşadası Reklam & Fotoğraf Ajansı`} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://erberkay.github.io/adareklam/" />
        {settings.heroImage && <meta property="og:image" content={settings.heroImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${siteName} — Kuşadası Reklam & Fotoğraf Ajansı`} />
        <meta name="twitter:description" content={desc} />
      </Helmet>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <PortfolioPreview />
      <TestimonialsSection />
      <BrandsSection />
      <CTASection />
    </PageTransition>
  );
}
