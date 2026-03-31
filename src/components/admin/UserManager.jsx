import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCollection, updateDocument, orderBy } from '../../hooks/useFirestore';
import { Shield, User } from 'lucide-react';

export default function UserManager() {
  const { data: users, loading } = useCollection('users', [orderBy('createdAt', 'desc')]);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    await updateDocument('users', user.id, { role: newRole });
    toast.success(`${user.displayName || user.email} → ${newRole}`);
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '2rem' }}>Kullanıcı Yönetimi</h1>
      {loading ? <p style={{ color: 'var(--color-text-muted)' }}>Yükleniyor...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {users?.map((user) => (
            <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {user.role === 'admin' ? <Shield size={18} style={{ color: '#000' }} /> : <User size={18} style={{ color: 'var(--color-text-secondary)' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{user.displayName || '—'}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{user.email}</p>
              </div>
              <button
                onClick={() => toggleRole(user)}
                style={{ padding: '8px 18px', borderRadius: '50px', border: '1px solid var(--glass-border)', background: user.role === 'admin' ? 'rgba(200,164,92,0.1)' : 'var(--glass-bg)', color: user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
              >
                {user.role === 'admin' ? 'Admin' : 'Müşteri'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
