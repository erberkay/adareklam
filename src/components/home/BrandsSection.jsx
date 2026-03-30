import RevealOnScroll from '../ui/RevealOnScroll';

const BRANDS = ['Marka A', 'Marka B', 'Marka C', 'Marka D', 'Marka E', 'Marka F', 'Marka G', 'Marka H'];

export default function BrandsSection() {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <section style={{ padding: '3rem 0', background: 'var(--color-bg-tertiary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
      <RevealOnScroll variant="fadeUp" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="section-label">Birlikte Çalıştığımız Markalar</span>
      </RevealOnScroll>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="marquee-track">
          {doubled.map((brand, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3rem', minWidth: '120px',
                color: 'var(--color-text-muted)', fontFamily: 'Sora, sans-serif',
                fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em',
                transition: 'color 0.3s',
                whiteSpace: 'nowrap',
              }}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
