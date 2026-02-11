import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageSpinner } from '../common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
