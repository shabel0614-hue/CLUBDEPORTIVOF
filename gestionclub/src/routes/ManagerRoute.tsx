import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ManagerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // Permitimos el paso si es Admin O si es Fundador
  const isManager = user?.role === 'Admin' || user?.role === 'Fundador';

  return isManager ? <Outlet /> : <Navigate to="/dashboard" />;
};