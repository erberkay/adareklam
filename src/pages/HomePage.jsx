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
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);
  return (
    <PageTransition>
      <Helmet>
        <title>{siteName} — Kuşadası Reklam & Fotoğraf Ajansı</title>
        <meta name="description" content="Kuşadası'nın önde gelen reklam ve fotoğraf ajansı. Profesyonel fotoğraf çekimi, web tasarımı ve sosyal medya yönetimi." />
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
