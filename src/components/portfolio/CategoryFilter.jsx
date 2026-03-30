import { motion } from 'framer-motion';
import { PORTFOLIO_CATEGORIES } from '../../lib/constants';

export default function CategoryFilter({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
      justifyContent: 'center', marginBottom: '2.5rem',
    }}>
      {PORTFOLIO_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          style={{
            position: 'relative',
            padding: '8px 20px', borderRadius: '50px',
            border: '1px solid var(--glass-border)',
            background: active === cat.id ? 'var(--color-primary)' : 'var(--glass-bg)',
            color: active === cat.id ? '#000' : 'var(--color-text-secondary)',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem',
            cursor: 'pointer', transition: 'all 0.3s ease',
            backdropFilter: 'blur(var(--glass-blur))',
          }}
        >
          {active === cat.id && (
            <motion.span
              layoutId="category-indicator"
              style={{
                position: 'absolute', inset: 0,
                background: 'var(--color-primary)',
                borderRadius: '50px', zIndex: -1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          {cat.label}
        </button>
      ))}
    </div>
  );
}
