import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, PlusCircle, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import PageTransition from '../components/layout/PageTransition';
import QuoteRequestForm from '../components/customer/QuoteRequestForm';
import MyQuotes from '../components/customer/MyQuotes';
import useAuthStore from '../store/useAuthStore';
import useSiteSettingsStore from '../store/useSiteSettingsStore';
import { auth } from '../lib/firebase';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { useCollection, where } from '../hooks/useFirestore';
import { staggerContainer, staggerItem } from '../lib/animations';
import { useInView } from 'react-intersection-observer';

const TABS = [
  { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: 'yeni-talep', label: 'Teklif Al', icon: PlusCircle },
  { id: 'taleplerim', label: 'Taleplerim', icon: FileText },
  { id: 'profil', label: 'Profil', icon: User },
];

export default function CustomerPanel() {
  const [tab, setTab] = useState('dashboard');
  const { user } = useAuthStore();
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);
  const { data: quotes } = useCollection('quotes', [where('userId', '==', user?.uid || '')]);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const pending = quotes?.filter((q) => q.status === 'pending').length || 0;
  const total = quotes?.length || 0;
  const accepted = quotes?.filter((q) => q.status === 'accepted').length || 0;

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Çıkış yapıldı');
  };

  return (
    <PageTransition>
      <Helmet><title>Müşteri Paneli — {siteName}</title></Helmet>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px', flexShrink: 0,
          background: 'var(--color-bg-secondary)',
          borderRight: '1px solid var(--glass-border)',
          padding: '2rem 1rem',
          display: 'flex', flexDirection: 'column',
          position: 'sticky', top: 0, height: '100vh',
        }}>
          <div style={{ marginBottom: '2rem', paddingLeft: '0.75rem' }}>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {siteName}
            </span>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>Müşteri Paneli</p>
          </div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setTab(id)}
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '10px 12px', borderRadius: '10px', border: 'none',
                  background: tab === id ? 'rgba(200,164,92,0.1)' : 'transparent',
                  color: tab === id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem',
                  transition: 'all 0.2s ease', textAlign: 'left', width: '100%',
                  borderLeft: tab === id ? '2px solid var(--color-primary)' : '2px solid transparent',
                }}
              >
                <Icon size={18} />
                {label}
              </motion.button>
            ))}
          </nav>
          <button onClick={handleLogout} className="btn-ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '10px 12px', width: '100%', justifyContent: 'flex-start' }}>
            <LogOut size={16} /> Çıkış
          </button>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {tab === 'dashboard' && (
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Merhaba, {user?.displayName?.split(' ')[0] || 'Merhaba'} 👋
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Hoş geldiniz! Teklif taleplerinizi buradan yönetebilirsiniz.</p>
              <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[{ label: 'Toplam Talep', value: total }, { label: 'Bekleyen', value: pending }, { label: 'Onaylanan', value: accepted }].map((s, i) => (
                  <motion.div key={i} variants={staggerItem} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--color-primary)' }}>
                      <AnimatedCounter target={s.value} />
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => setTab('yeni-talep')} className="btn-primary">Yeni Teklif Al</button>
                <button onClick={() => setTab('taleplerim')} className="btn-ghost">Taleplerim</button>
              </div>
            </div>
          )}

          {tab === 'yeni-talep' && (
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '2rem' }}>Yeni Teklif Talebi</h1>
              <div className="glass-card" style={{ padding: '2rem', maxWidth: '640px' }}>
                <QuoteRequestForm onSuccess={() => setTab('taleplerim')} />
              </div>
            </div>
          )}

          {tab === 'taleplerim' && (
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '2rem' }}>Teklif Taleplerim</h1>
              <MyQuotes />
            </div>
          )}

          {tab === 'profil' && (
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '2rem' }}>Profil</h1>
              <div className="glass-card" style={{ padding: '2rem', maxWidth: '480px' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#000' }}>
                    {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--color-text-primary)' }}>{user?.displayName || '—'}</p>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{user?.email}</p>
                    <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', marginTop: '2px' }}>Müşteri</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
