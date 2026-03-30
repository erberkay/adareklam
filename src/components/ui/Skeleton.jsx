export function Skeleton({ width = '100%', height = '1rem', rounded = '8px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: rounded }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <Skeleton height="200px" rounded="12px" />
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton height="1.2rem" width="70%" />
        <Skeleton height="0.9rem" width="90%" />
        <Skeleton height="0.9rem" width="60%" />
      </div>
    </div>
  );
}
