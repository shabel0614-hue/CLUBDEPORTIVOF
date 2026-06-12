import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clubService } from "../../services/clubService";
import { resourceService } from "../../services/resourceService";
import { trainingService } from "../../services/trainingService";
import type { ClubResponseDto } from "../../types/club";
import type { ResourceResponseDto } from "../../types/resource";
import type { TrainingResponseDto } from "../../types/training";
import type { UserDto } from "../../types/auth";
import ConfirmDialog from "../../components/ConfirmDialog";
import Seo from "../../components/Seo";
import "../../App.css";

const FALLBACK_LOGO = "https://placehold.co/240x240/0d1b2a/00c6ff?text=Club";

export default function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [club, setClub] = useState<ClubResponseDto | null>(null);
  const [members, setMembers] = useState<UserDto[]>([]);
  const [resources, setResources] = useState<ResourceResponseDto[]>([]);
  const [trainings, setTrainings] = useState<TrainingResponseDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [joinLoading, setJoinLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setNotFound(false);
    setError("");

    clubService
      .getById(id)
      .then((data) => {
        setClub(data);
        // Cargar datos relacionados, sin bloquear si fallan
        resourceService.getByClub(id).then(setResources).catch(() => {});
        trainingService.getByClub(id).then(setTrainings).catch(() => {});
        if (isAuthenticated) {
          clubService.getMembers(id).then(setMembers).catch(() => {});
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else setError("No se pudo cargar la información del club.");
      })
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const isMember = !!user && members.some((m) => m.id === user.id);
  const canManage =
    !!user && (user.role === "Admin" || (user.role === "Fundador" && club?.founderId === user.id));

  const handleJoin = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/clubs/${id}` } } });
      return;
    }
    setJoinLoading(true);
    setError("");
    try {
      await clubService.join(id);
      setSuccessMsg("¡Te has unido al club correctamente!");
      const updatedMembers = await clubService.getMembers(id);
      setMembers(updatedMembers);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || "No se pudo completar la acción.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      await clubService.delete(id);
      navigate("/clubs");
    } catch (err: any) {
      setError(err.response?.data?.message || "No se pudo eliminar el club.");
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="state-message">
        <div className="spinner" />
        <p>Cargando información del club...</p>
      </div>
    );
  }

  if (notFound || !club) {
    return (
      <div className="state-message">
        <h3>Club no encontrado</h3>
        <p>El club que buscas no existe o fue eliminado.</p>
        <Link to="/clubs" className="btn btn-primary" style={{ marginTop: 16 }}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell club-detail">
      <Seo
        title={club.name}
        description={club.description || `Conoce el club ${club.name}, parte de Impulse Club.`}
        image={club.logoUrl || undefined}
      />

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="club-detail-header card">
        <img
          src={club.logoUrl || FALLBACK_LOGO}
          alt={`Logo del club ${club.name}`}
          className="club-detail-logo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_LOGO;
          }}
        />

        <div className="club-detail-info">
          <span className="badge badge-accent">{club.sportType}</span>
          <h1>{club.name}</h1>
          <p className="club-detail-desc">{club.description || "Este club no tiene descripción aún."}</p>

          <dl className="club-detail-meta">
            <div>
              <dt>Facultad / Área</dt>
              <dd>{club.facultyOrArea || "—"}</dd>
            </div>
            <div>
              <dt>Dirección</dt>
              <dd>{club.address || "—"}</dd>
            </div>
            <div>
              <dt>Capacidad máxima</dt>
              <dd>{club.maxCapacity} miembros</dd>
            </div>
            <div>
              <dt>Miembros actuales</dt>
              <dd>{members.length}</dd>
            </div>
            <div>
              <dt>Fundador</dt>
              <dd>{club.founderName || "—"}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <span className={`badge ${club.isApproved ? "badge-success" : "badge-warning"}`}>
                  {club.isApproved ? "Aprobado" : "Pendiente de aprobación"}
                </span>
              </dd>
            </div>
          </dl>

          <div className="club-detail-actions">
            {!isMember && (
              <button className="btn btn-primary" onClick={handleJoin} disabled={joinLoading}>
                {joinLoading ? "Procesando..." : "Unirme al club"}
              </button>
            )}
            {isMember && <span className="badge badge-success">Ya eres miembro de este club</span>}

            {canManage && (
              <>
                <Link to={`/clubs/${club.id}/edit`} className="btn btn-secondary">
                  Editar club
                </Link>
                <button className="btn btn-danger" onClick={() => setShowDeleteDialog(true)}>
                  Eliminar club
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Entrenamientos --- */}
      <section className="club-section" aria-labelledby="trainings-heading">
        <div className="section-header">
          <h2 id="trainings-heading">Entrenamientos</h2>
          {canManage && (
            <Link to={`/trainings/new?clubId=${club.id}`} className="btn btn-primary btn-sm">
              + Nuevo entrenamiento
            </Link>
          )}
        </div>

        {trainings.length === 0 ? (
          <p className="empty-text">Este club no tiene entrenamientos programados.</p>
        ) : (
          <div className="grid-mini">
            {trainings.map((t) => (
              <div key={t.id} className="mini-card">
                <h3>{t.name}</h3>
                <p className="mini-meta">
                  📅 {new Date(t.date).toLocaleString("es-BO", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <p className="mini-meta">📍 {t.location}</p>
                <p className="mini-meta">
                  👥 {t.registeredParticipantsCount}/{t.maxParticipants} participantes
                </p>
                <span className="badge badge-accent">{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Recursos --- */}
      <section className="club-section" aria-labelledby="resources-heading">
        <div className="section-header">
          <h2 id="resources-heading">Recursos del club</h2>
          {canManage && (
            <Link to={`/resources/new?clubId=${club.id}`} className="btn btn-primary btn-sm">
              + Nuevo recurso
            </Link>
          )}
        </div>

        {resources.length === 0 ? (
          <p className="empty-text">Este club no tiene recursos registrados.</p>
        ) : (
          <div className="grid-mini">
            {resources.map((r) => (
              <div key={r.id} className="mini-card">
                <h3>{r.name}</h3>
                <p className="mini-meta">🏷️ {r.type}</p>
                <p className="mini-meta">📦 Cantidad: {r.totalQuantity}</p>
                <p className="mini-meta">🏫 {r.campus}</p>
                <span
                  className={`badge ${r.status === "Disponible" ? "badge-success" : "badge-warning"}`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Eliminar club"
        message={`¿Estás seguro de que deseas eliminar "${club.name}"? Esta acción no se puede deshacer y eliminará también sus recursos y entrenamientos asociados.`}
        confirmLabel={deleteLoading ? "Eliminando..." : "Sí, eliminar"}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}