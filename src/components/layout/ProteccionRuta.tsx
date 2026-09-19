// Libraries
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Context
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/usuarios' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
