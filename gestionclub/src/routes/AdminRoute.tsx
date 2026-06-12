import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="state-message">
        <div className="spinner" />
        <p>Verificando permisos...</p>
      </div>
    );
  }

  return user?.role === "Admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}