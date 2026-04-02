import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

import SmoothScroll from './components/layout/SmoothScroll';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import { useAuthListener } from './hooks/useAuth';
import { useSiteSettingsListener } from './hooks/useSiteSettings';
import useSiteSettingsStore from './store/useSiteSettingsStore';
import { Skeleton } from './components/ui/Skeleton';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CustomerPanel = lazy(() => import('./pages/CustomerPanel'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function PageFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '8rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Skeleton height="2.5rem" width="60%" />
      <Skeleton height="1rem" />
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="1rem" width="70%" />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolyo" element={<PortfolioPage />} />
            <Route path="/hizmetler" element={<ServicesPage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/giris" element={<LoginPage />} />
            <Route path="/kayit" element={<RegisterPage />} />
            <Route
              path="/musteri"
              element={<ProtectedRoute><CustomerPanel /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<AdminRoute><AdminPanel /></AdminRoute>}
            />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

function AppInit() {
  useAuthListener();
  useSiteSettingsListener();

  const logo = useSiteSettingsStore((s) => s.settings.logo);
  useEffect(() => {
    if (!logo) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logo;
  }, [logo]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
    <HelmetProvider>
      <BrowserRouter basename="/adareklam">
        <SmoothScroll>
          <AppInit />
          <CustomCursor />
          <LoadingScreen />
          <AppRoutes />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--glass-border)',
                color: 'var(--color-text-primary)',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </SmoothScroll>
      </BrowserRouter>
    </HelmetProvider>
    </ErrorBoundary>
  );
}
