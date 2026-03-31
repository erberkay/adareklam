export const SERVICES = [
  { id: 'urun-cekimi', label: 'Ürün Çekimi' },
  { id: 'mekan-cekimi', label: 'Mekan Çekimi' },
  { id: 'reklam', label: 'Reklam' },
  { id: 'sosyal-medya', label: 'Sosyal Medya' },
  { id: 'web-tasarim', label: 'Web Tasarım' },
];

export const PORTFOLIO_CATEGORIES = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'urun-cekimi', label: 'Ürün Çekimi' },
  { id: 'mekan-cekimi', label: 'Mekan Çekimi' },
  { id: 'reklam', label: 'Reklam' },
  { id: 'sosyal-medya', label: 'Sosyal Medya' },
  { id: 'web-tasarim', label: 'Web Tasarım' },
];

export const BUDGET_OPTIONS = [
  { value: '1000-3000', label: '₺1.000 - ₺3.000' },
  { value: '3000-5000', label: '₺3.000 - ₺5.000' },
  { value: '5000-10000', label: '₺5.000 - ₺10.000' },
  { value: '10000+', label: '₺10.000+' },
];

export const QUOTE_STATUSES = {
  pending: { label: 'Beklemede', color: 'warning' },
  reviewed: { label: 'İncelendi', color: 'info' },
  quoted: { label: 'Fiyat Verildi', color: 'primary' },
  accepted: { label: 'Kabul Edildi', color: 'success' },
  rejected: { label: 'Reddedildi', color: 'error' },
};

export const NAV_LINKS = [
  { path: '/', label: 'Ana Sayfa' },
  { path: '/portfolyo', label: 'Portfolyo' },
  { path: '/hizmetler', label: 'Hizmetler' },
  { path: '/hakkimizda', label: 'Hakkımızda' },
  { path: '/iletisim', label: 'İletişim' },
];

export const DEFAULT_SITE_SETTINGS = {
  siteName: 'Ada Reklamcılık',
  tagline: "Kuşadası'nın Kreatif Ajansı",
  phone: '+90 256 000 00 00',
  email: 'info@adareklamcilik.com',
  address: 'Kuşadası, Aydın',
  socialMedia: {
    instagram: '',
    facebook: '',
    youtube: '',
    whatsapp: '+905000000000',
  },
  aboutText: 'Kuşadası\'nda profesyonel reklam ve fotoğraf hizmetleri sunuyoruz.',
  heroImage: '',
  heroVideo: '',
  heroSubtitle: 'Profesyonel fotoğraf çekimi, reklam tasarımı ve dijital pazarlama çözümleriyle markanızı bir adım öne taşıyoruz.',
  brands: ['Marka A', 'Marka B', 'Marka C', 'Marka D', 'Marka E', 'Marka F', 'Marka G', 'Marka H'],
  primaryColor: '#c8a45c',
  stats: {
    projectCount: 150,
    clientCount: 80,
    yearExperience: 5,
    photoCount: 10000,
  },
};
