import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen label="Opening your snippets…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export function PublicOnly({ children }) {
  const { user, loading, redirectPath } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={redirectPath || '/dashboard'} replace />;
  return children;
}
