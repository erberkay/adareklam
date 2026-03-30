import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import SiteSettings from '../components/admin/SiteSettings';
import PortfolioManager from '../components/admin/PortfolioManager';
import QuoteManager from '../components/admin/QuoteManager';
import ServiceManager from '../components/admin/ServiceManager';
import UserManager from '../components/admin/UserManager';
import TestimonialManager from '../components/admin/TestimonialManager';
import useSiteSettingsStore from '../store/useSiteSettingsStore';
import { motion, AnimatePresence } from 'framer-motion';

const CONTENT_MAP = {
  'dashboard': AdminDashboard,
  'site-ayarlari': SiteSettings,
  'portfolyo': PortfolioManager,
  'teklifler': QuoteManager,
  'hizmetler': ServiceManager,
  'kullanicilar': UserManager,
  'referanslar': TestimonialManager,
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);
  const ActiveComponent = CONTENT_MAP[activeTab] || AdminDashboard;

  return (
    <>
      <Helmet><title>Admin Paneli — {siteName}</title></Helmet>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          <div style={{ padding: '2.5rem', maxWidth: '1100px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
