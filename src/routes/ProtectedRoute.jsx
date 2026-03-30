import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Skeleton } from '../components/ui/Skeleton';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="1rem" />
        <Skeleton height="1rem" width="80%" />
      </div>
    );
  }

  if (!user) return <Navigate to="/giris" replace />;
  return children;
}
