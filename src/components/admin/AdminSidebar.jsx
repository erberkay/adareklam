import { motion } from 'framer-motion';
import { LayoutDashboard, Settings, ImageIcon, FileText, Briefcase, Users, Star, ChevronLeft, ChevronRight, LogOut, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '../../lib/firebase';
import useUIStore from '../../store/useUIStore';
import useSiteSettingsStore from '../../store/useSiteSettingsStore';

export const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'site-ayarlari', label: 'Site Ayarları', icon: Settings },
  { id: 'portfolyo', label: 'Portfolyo', icon: ImageIcon },
  { id: 'teklifler', label: 'Teklifler', icon: FileText },
  { id: 'hizmetler', label: 'Hizmetler', icon: Briefcase },
  { id: 'kullanicilar', label: 'Kullanıcılar', icon: Users },
  { id: 'referanslar', label: 'Referanslar', icon: Star },
];

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Çıkış yapıldı');
  };

  const w = sidebarCollapsed ? '72px' : '240px';

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        flexShrink: 0, background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'sticky', top: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '1.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', borderBottom: '1px solid var(--glass-border)' }}>
        {!sidebarCollapsed && (
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {siteName}
          </span>
        )}
        <button onClick={toggleSidebarCollapsed} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setActiveTab(id)}
            whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
            title={sidebarCollapsed ? label : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '10px 12px', borderRadius: '10px', border: 'none',
              background: activeTab === id ? 'rgba(200,164,92,0.1)' : 'transparent',
              color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem',
              transition: 'all 0.2s ease', textAlign: 'left', width: '100%',
              borderLeft: activeTab === id ? '2px solid var(--color-primary)' : '2px solid transparent',
              whiteSpace: 'nowrap', overflow: 'hidden', justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && label}
          </motion.button>
        ))}
      </nav>

      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link to="/" title={sidebarCollapsed ? 'Siteye Dön' : undefined} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '10px 12px', borderRadius: '10px',
          color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          transition: 'color 0.2s',
        }}>
          <Home size={18} style={{ flexShrink: 0 }} />
          {!sidebarCollapsed && 'Siteye Dön'}
        </Link>
        <button onClick={handleLogout} title={sidebarCollapsed ? 'Çıkış' : undefined} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '10px 12px', borderRadius: '10px', border: 'none',
          background: 'transparent', color: 'var(--color-text-secondary)',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        }}>
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!sidebarCollapsed && 'Çıkış'}
        </button>
      </div>
    </motion.aside>
  );
}
