import { Link } from "react-router-dom";
import type { ClubResponseDto } from "../types/club";

const FALLBACK_LOGO = "https://placehold.co/200x200/f1efe8/888780?text=Club";

const SPORT_ICONS: Record<string, string> = {
  fútbol: "⚽", futbol: "⚽", baloncesto: "🏀", básquet: "🏀",
  natación: "🏊", tenis: "🎾", voleibol: "🏐", atletismo: "🏃",
  rugby: "🏉", handball: "🤾", judo: "🥋", karate: "🥋",
};

function getSportIcon(sport: string): string {
  const key = sport.toLowerCase();
  for (const [k, v] of Object.entries(SPORT_ICONS)) {
    if (key.includes(k)) return v;
  }
  return "🏆";
}

export default function ClubCard({ club }: { club: ClubResponseDto }) {
  const capacityPct = club.maxCapacity > 0
    ? Math.min(100, Math.round(((club.memberCount ?? 0) / club.maxCapacity) * 100))
    : 0;

  return (
    <article
      className="club-card"
      aria-label={`Club ${club.name}, ${club.sportType}`}
    >
      {/* Header */}
      <div className="club-card-header">
        <div className="club-card-logo-wrap" aria-hidden="true">
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt=""
              className="club-card-logo"
              width="48"
              height="48"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_LOGO; }}
            />
          ) : (
            <span className="club-card-logo-fallback" role="img" aria-label={club.sportType}>
              {getSportIcon(club.sportType)}
            </span>
          )}
        </div>
        <div className="club-card-header-text">
          <h3 className="club-card-title">{club.name}</h3>
          <span className="badge badge-sport">{club.sportType}</span>
        </div>
      </div>

      {/* Description */}
      <p className="club-card-desc">
        {club.description || "Este club aún no agregó una descripción."}
      </p>

      {/* Meta */}
      <dl className="club-card-meta">
        <div className="club-card-meta-item">
          <dt>Facultad</dt>
          <dd>{club.facultyOrArea || "—"}</dd>
        </div>
        <div className="club-card-meta-item">
          <dt>Capacidad</dt>
          <dd>{club.maxCapacity} miembros</dd>
        </div>
      </dl>

      {/* Capacity bar — only if memberCount available */}
      {club.memberCount !== undefined && (
        <div className="club-card-capacity" aria-label={`${capacityPct}% de capacidad ocupada`}>
          <div className="club-card-capacity-bar">
            <div
              className="club-card-capacity-fill"
              style={{ width: `${capacityPct}%` }}
              role="presentation"
            />
          </div>
          <span className="club-card-capacity-label">{club.memberCount}/{club.maxCapacity}</span>
        </div>
      )}

      {/* Footer row */}
      <div className="club-card-footer">
        <span className={`badge ${club.isApproved ? "badge-ok" : "badge-pending"}`}>
          {club.isApproved ? "✓ Aprobado" : "⏳ Pendiente"}
        </span>
        <Link
          to={`/clubs/${club.id}`}
          className="btn-card-detail"
          aria-label={`Ver detalles del club ${club.name}`}
        >
          Ver detalles →
        </Link>
        <button 
            className="btn btn-danger btn-sm" 
            onClick={() => onDelete(club.id)}
            aria-label="Eliminar club"
          >
            🗑️
          </button>
      </div>
    </article>
  );
}
