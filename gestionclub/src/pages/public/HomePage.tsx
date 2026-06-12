import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clubService } from "../../services/clubService";
import type { ClubResponseDto } from "../../types/club";
import ClubCard from "../../components/ClubCard";
import Seo from "../../components/Seo";
import "../../App.css";

export default function HomePage() {
  const [clubs, setClubs] = useState<ClubResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clubService
      .getAll()
      .then((data) => setClubs(data.slice(0, 3)))
      .catch(() => setError("No se pudieron cargar los clubes destacados en este momento."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page-wrapper">
      <Seo
        title="Inicio"
        description="Impulse Club: la plataforma oficial para descubrir, gestionar y unirte a los clubes deportivos de tu universidad."
      />

      {/* Hero Section: Añadimos una clase de contenedor para dar el estilo de degradado */}
      <section className="hero-gradient" aria-label="Presentación">
        <div className="hero-inner">
          <span className="badge badge-accent hero-eyebrow">Gestión deportiva universitaria</span>
          <h1 className="hero-title">
            Conecta con el deporte de tu campus, <span>impulsa tu equipo</span>.
          </h1>
          <p className="hero-subtitle">
            Explora los clubes deportivos de tu universidad, únete a entrenamientos, reserva recursos y administra tu equipo desde un solo lugar.
          </p>
          <div className="hero-actions">
            <Link to="/clubs" className="btn btn-primary">Explorar clubes</Link>
            <Link to="/register" className="btn btn-secondary">Crear cuenta gratis</Link>
          </div>

          {/* Estadísticas: Ahora en un contenedor tipo "Card Grid" */}
          <dl className="hero-stats-grid">
            <div className="stat-card">
              <dt>Clubes activos</dt>
              <dd>{loading ? "—" : clubs.length > 0 ? "+10" : "0"}</dd>
            </div>
            <div className="stat-card">
              <dt>Deportes</dt>
              <dd>Múltiples</dd>
            </div>
            <div className="stat-card">
              <dt>Acceso</dt>
              <dd>24/7</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Resto de secciones manteniendo tu lógica intacta */}
      <section className="page-shell" aria-labelledby="featured-heading">
        <div className="section-header">
          <div>
            <h2 id="featured-heading">Clubes destacados</h2>
            <p className="section-subtitle">Descubre algunos de los clubes activos en el campus.</p>
          </div>
          <Link to="/clubs" className="btn btn-ghost btn-sm">Ver todos →</Link>
        </div>

        {loading && (
          <div className="state-message">
            <div className="spinner" />
            <p>Cargando clubes destacados...</p>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && clubs.length === 0 && (
          <div className="state-message">
            <h3>Aún no hay clubes registrados</h3>
            <p>Vuelve más tarde o crea una cuenta para fundar el primero.</p>
          </div>
        )}

        {!loading && clubs.length > 0 && (
          <div className="grid-clubs">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>

      <section className="features-section">
        <div className="page-shell">
          <h2 className="section-title-center">Todo lo que necesitas para tu club</h2>
          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">🏟️</div>
              <h3>Catálogo de clubes</h3>
              <p>Explora todos los clubes deportivos disponibles por facultad y tipo de deporte.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">📅</div>
              <h3>Entrenamientos</h3>
              <p>Programa, edita y únete a sesiones de entrenamiento con cupo y horario definidos.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">🎒</div>
              <h3>Recursos compartidos</h3>
              <p>Gestiona inventario y reserva equipo deportivo disponible para tu club.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">🔐</div>
              <h3>Roles y permisos</h3>
              <p>Administradores, fundadores y miembros tienen accesos adaptados a sus funciones.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}