import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { trainingService } from "../../services/trainingService";
import { clubService } from "../../services/clubService";
import type { ClubResponseDto } from "../../types/club";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function TrainingNew() {
  const query = useQuery();
  const initialClubId = query.get("clubId") || "";
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", date: "", location: "", maxParticipants: 10 });
  const [clubId, setClubId] = useState(initialClubId);
  const [clubs, setClubs] = useState<ClubResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(!initialClubId);
  const [err, setErr] = useState("");
  const [clubLoadError, setClubLoadError] = useState("");

  useEffect(() => {
    if (initialClubId) {
      setClubId(initialClubId);
      setLoadingClubs(false);
      return;
    }

    setLoadingClubs(true);
    clubService
      .getAll()
      .then(setClubs)
      .catch(() => setClubLoadError("No se pudieron cargar los clubes. Recarga la página."))
      .finally(() => setLoadingClubs(false));
  }, [initialClubId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!clubId) {
      setErr("Selecciona un club antes de continuar.");
      return;
    }

    setLoading(true);
    try {
      await trainingService.create({
        name: form.name,
        date: form.date,
        location: form.location,
        maxParticipants: form.maxParticipants,
        clubId,
        duration: 60,
        coachName: "",
        status: "Programado",
        usedResources: "",
      });
      navigate(clubId ? `/club/${clubId}` : "/trainings");
    } catch (err: any) {
      setErr(err?.response?.data?.message || "Error al crear el entrenamiento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <h1>Nuevo entrenamiento</h1>
      {err && <div className="alert alert-error">{err}</div>}
      <form onSubmit={submit} className="form-grid-2">
        {!initialClubId && (
          <div className="form-group">
            <label htmlFor="club-select">Club</label>
            {loadingClubs ? (
              <p>Cargando clubes...</p>
            ) : (
              <select
                id="club-select"
                className="form-select"
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                required
              >
                <option value="">Selecciona un club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            )}
            {clubLoadError && <p className="form-error">{clubLoadError}</p>}
          </div>
        )}

        <div className="form-group">
          <label>Nombre</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora</label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Lugar</label>
          <input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Máx participantes</label>
          <input
            type="number"
            value={form.maxParticipants}
            onChange={(e) => setForm((f) => ({ ...f, maxParticipants: Number(e.target.value) }))}
            className="form-input"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" type="submit" disabled={loading || loadingClubs}>
            {loading ? 'Procesando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}
