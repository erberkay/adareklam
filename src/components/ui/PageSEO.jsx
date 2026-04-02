import { Helmet } from 'react-helmet-async';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';

const BASE_URL = 'https://erberkay.github.io/adareklam';

/**
 * Sayfa başına SEO meta etiketleri + JSON-LD.
 * @param {string}  title      - Sayfa başlığı (site adı eklenir)
 * @param {string}  description
 * @param {string}  path       - URL yolu, ör. '/hizmetler'
 * @param {string}  [image]    - OG resmi (yoksa heroImage kullanılır)
 * @param {boolean} [noindex]  - Auth sayfaları için true
 * @param {object}  [jsonLd]   - Ek schema.org verisi
 */
export default function PageSEO({ title, description, path = '/', image, noindex = false, jsonLd }) {
  const settings = useSiteSettingsStore((s) => s.settings);

  const fullTitle = title
    ? `${title} — ${settings.siteName}`
    : `${settings.siteName} — Kuşadası Reklam & Fotoğraf Ajansı`;

  const desc = description || settings.tagline || 'Kuşadası\'nda profesyonel reklam, fotoğraf çekimi ve dijital pazarlama hizmetleri.';
  const canonical = BASE_URL + path;
  // heroImage → logo → yok (boş bırakma yerine hiç tag ekleme)
  const ogImage = image || settings.heroImage || settings.logo || null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:site_name" content={settings.siteName} />
      <meta property="og:locale" content="tr_TR" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={fullTitle} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {ogImage && <meta name="twitter:image:alt" content={fullTitle} />}

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
