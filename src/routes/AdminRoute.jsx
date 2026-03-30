import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Skeleton } from '../components/ui/Skeleton';

export default function AdminRoute({ children }) {
  const { user, userRole, loading } = useAuthStore();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="1rem" />
      </div>
    );
  }

  if (!user) return <Navigate to="/giris" replace />;
  if (userRole !== 'admin') return <Navigate to="/musteri" replace />;
  return children;
}
