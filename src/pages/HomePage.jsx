import PageTransition from '../components/layout/PageTransition';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import StatsSection from '../components/home/StatsSection';
import PortfolioPreview from '../components/home/PortfolioPreview';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BrandsSection from '../components/home/BrandsSection';
import CTASection from '../components/home/CTASection';
import useSiteSettingsStore from '../store/useSiteSettingsStore';
import PageSEO from '../components/ui/PageSEO';

const BASE_URL = 'https://erberkay.github.io/adareklam';

export default function HomePage() {
  const settings = useSiteSettingsStore((s) => s.settings);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': BASE_URL + '/#organization',
      name: settings.siteName,
      description: settings.tagline,
      url: BASE_URL,
      telephone: settings.phone,
      email: settings.email,
      image: settings.heroImage || undefined,
      logo: settings.logo || undefined,
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
      sameAs: [
        settings.socialMedia?.instagram,
        settings.socialMedia?.facebook,
        settings.socialMedia?.youtube,
      ].filter(Boolean),
      priceRange: '₺₺',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: BASE_URL,
      name: settings.siteName,
      potentialAction: {
        '@type': 'SearchAction',
        target: BASE_URL + '/portfolyo?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return (
    <PageTransition>
      <PageSEO
        description="Kuşadası'nın önde gelen reklam ve fotoğraf ajansı. Profesyonel fotoğraf çekimi, web tasarımı ve sosyal medya yönetimi."
        path="/"
        jsonLd={jsonLd}
      />
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
