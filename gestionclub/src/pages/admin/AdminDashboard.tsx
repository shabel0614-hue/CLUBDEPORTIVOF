import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Seo from "../../components/Seo";
import "../../App.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
  document.title = "Panel de Gestión – Impulse Club";
  // Permitimos si es Admin O Fundador
  if (!loading && user?.role !== "Admin" && user?.role !== "Fundador") {
    navigate("/dashboard");
  }
}, [user, loading, navigate]);
  if (loading) {
    return (
      <div className="state-message">
        <div className="spinner" />
        <p>Verificando permisos...</p>
      </div>
    );
  }

  return (
    <>
      <Seo title="Administración" description="Panel de administración de Impulse Club." />

      {/* Banner con gradiente tipo "Dashboard Hero" */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-inner">
          <div className="dashboard-welcome">
            <span className="badge badge-accent">Panel de control</span>
            <h1>Administración ⚙️</h1>
            <p>Hola {user?.name}, gestiona la plataforma desde aquí.</p>
          </div>
        </div>
      </div>

      <div className="page-shell">
        <div className="section-header">
          <h2>Módulos del Sistema</h2>
        </div>

        {/* Usamos tu admin-nav-grid, pero asegúrate de tener el CSS abajo */}
        <div className="admin-nav-grid">
          {[
            { icon: "👥", title: "Gestionar Usuarios", path: "/admin/users", desc: "Ver, editar roles y cuentas." },
            { icon: "🏟️", title: "Gestionar Clubes", path: "/admin/clubs", desc: "Aprobar y editar clubes." },
            { icon: "➕", title: "Crear Club", path: "/clubs/new", desc: "Añadir nuevo club al catálogo." },
            { icon: "📅", title: "Crear Entrenamiento", path: "/trainings/new", desc: "Programar sesiones." },
            { icon: "🎒", title: "Crear Recurso", path: "/resources/new", desc: "Gestionar inventario." }
          ].map((item, index) => (
            <div key={index} className="admin-nav-card" onClick={() => navigate(item.path)} role="button" tabIndex={0}>
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default AdminDashboard;