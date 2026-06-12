import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clubService } from "../../services/clubService";
import type { ClubResponseDto } from "../../types/club";
import ClubCard from "../../components/ClubCard";
import Seo from "../../components/Seo";
import "../../App.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [myClubs, setMyClubs] = useState<ClubResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Mi Panel – Impulse Club";
    clubService
      .getAll()
      .then((all) => {
        // Filter clubs user is member of (adjust logic per your API)
        setMyClubs(all.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Usuario";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <>
      <Seo title="Mi Panel" description="Tu panel personal de Impulse Club." />

      {/* Welcome banner */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-inner">
          <div className="dashboard-welcome">
            <h1>{greeting}, {firstName} 👋</h1>
            <p>Aquí tienes un resumen de tu actividad deportiva.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/clubs" className="btn btn-ghost btn-sm" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              Explorar clubes
            </Link>
            {(user?.role === "Fundador" || user?.role === "Admin") && (
              <Link to="/clubs/new" className="btn btn-gold btn-sm">
                + Nuevo club
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="page-shell">
        {/* Stats row */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div>
              <div className="stat-value">{myClubs.length}</div>
              <div className="stat-label">Clubes unidos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon gold">📅</div>
            <div>
              <div className="stat-value">0</div>
              <div className="stat-label">Próximos entrenos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">🎒</div>
            <div>
              <div className="stat-value">0</div>
              <div className="stat-label">Recursos reservados</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div>
              <div className="stat-value">{user?.role || "Usuario"}</div>
              <div className="stat-label">Tu rol</div>
            </div>
          </div>
        </div>

        {/* My clubs */}
        <div className="section-header">
          <div>
            <h2>Mis clubes</h2>
            <p className="section-subtitle">Clubes a los que perteneces actualmente.</p>
          </div>
          <Link to="/clubs" className="btn btn-ghost btn-sm">
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="state-message">
            <div className="spinner" />
            <p>Cargando tus clubes...</p>
          </div>
        ) : myClubs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏟️</div>
            <h3 className="empty-state-title">Aún no te has unido a ningún club</h3>
            <p>Explora el catálogo y únete a tu primera actividad deportiva.</p>
            <Link to="/clubs" className="btn btn-primary" style={{ marginTop: 16 }}>
              Explorar clubes
            </Link>
          </div>
        ) : (
          <div className="grid-clubs">
            {myClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};export default Dashboard;