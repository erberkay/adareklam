import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection, orderBy } from '../../hooks/useFirestore';
import { Skeleton } from '../ui/Skeleton';

export default function ContactManager() {
  const { data: contacts, loading } = useCollection('contacts', [orderBy('createdAt', 'desc')]);
  const unread = (contacts || []).filter((c) => !c.isRead).length;

  const markRead = async (id) => {
    await updateDoc(doc(db, 'contacts', id), { isRead: true });
    toast.success('Okundu olarak işaretlendi');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>
          İletişim Mesajları
        </h1>
        {unread > 0 && (
          <span style={{ background: 'var(--color-warning)', color: '#000', borderRadius: '50px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
            {unread} yeni
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} height="120px" />)}
        </div>
      ) : contacts.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Mail size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem', display: 'block' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Henüz mesaj yok</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {contacts.map((c) => (
            <ContactCard key={c.id} contact={c} onMarkRead={() => markRead(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContactCard({ contact, onMarkRead }) {
  const [expanded, setExpanded] = useState(false);
  const date = contact.createdAt?.toDate?.()?.toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) || '—';

  return (
    <motion.div
      layout
      className="glass-card"
      style={{
        padding: '1.5rem',
        borderLeft: `3px solid ${contact.isRead ? 'var(--glass-border)' : 'var(--color-warning)'}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--color-text-primary)' }}>{contact.name}</span>
            {!contact.isRead && (
              <span style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--color-warning)', borderRadius: '50px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600 }}>
                Yeni
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <a href={`mailto:${contact.email}`} style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>{contact.email}</a>
            {contact.phone && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{contact.phone}</span>}
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{date}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {!contact.isRead && (
            <button
              onClick={onMarkRead}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-success)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              <CheckCircle size={14} /> Okundu
            </button>
          )}
          <button
            onClick={() => setExpanded((p) => !p)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            {expanded ? 'Gizle' : 'Mesajı Gör'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="msg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{contact.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
