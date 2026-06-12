import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { clubService } from "../../services/clubService";
import type { ClubResponseDto } from "../../types/club";
import type { CreateClubDto } from "../../types/club";
import ClubCard from "../../components/ClubCard";
import Seo from "../../components/Seo";
import "../../App.css";

export default function ClubCatalogPage() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<ClubResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateClubDto>({ name: "", sportType: "", facultyOrArea: "", logoUrl: "", description: "", address: "", maxCapacity: 0 });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clubService
      .getAll()
      .then(setClubs)
      .catch(() => setError("No se pudieron cargar los clubes. Intenta más tarde."))
      .finally(() => setLoading(false));
  }, []);

  const sportTypes = useMemo(() => {
    const types = new Set(clubs.map((c) => c.sportType).filter(Boolean));
    return ["Todos", ...Array.from(types)];
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch = club.name.toLowerCase().includes(search.toLowerCase()) || club.facultyOrArea?.toLowerCase().includes(search.toLowerCase());
      const matchesSport = sportFilter === "Todos" || club.sportType === sportFilter;
      return matchesSearch && matchesSport;
    });
  }, [clubs, search, sportFilter]);

  const userHasNoClub = user?.role === "Fundador" || user?.role === "Admin";

  const handleChange = (field: keyof CreateClubDto) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: field === "maxCapacity" ? Number(e.target.value) : e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.sportType.trim()) {
      setFormError("Nombre y Deporte son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      await clubService.create(form);
      setForm({ name: "", sportType: "", facultyOrArea: "", logoUrl: "", description: "", address: "", maxCapacity: 0 });
      setShowForm(false);
      const updated = await clubService.getAll();
      setClubs(updated);
    } catch {
      setFormError("No se pudo crear el club.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <Seo
        title="Explorar clubes"
        description="Explora el catálogo completo de clubes deportivos universitarios disponibles en Impulse Club."
      />

      <div className="section-header">
        <div>
          <h1>Explora los clubes</h1>
          <p className="section-subtitle">
            Encuentra el club deportivo que se ajuste a tus intereses y únete a su comunidad.
          </p>
        </div>
        {userHasNoClub && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm">
            + Agregar Club
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Crear Nuevo Club</h3>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-input" value={form.name} onChange={handleChange("name")} />
              </div>
              <div className="form-group">
                <label className="form-label">Deporte *</label>
                <input className="form-input" value={form.sportType} onChange={handleChange("sportType")} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Facultad / Área</label>
                <input className="form-input" value={form.facultyOrArea} onChange={handleChange("facultyOrArea")} />
              </div>
              <div className="form-group">
                <label className="form-label">Capacidad Máxima</label>
                <input type="number" className="form-input" value={form.maxCapacity} onChange={handleChange("maxCapacity")} min="0" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input className="form-input" value={form.address} onChange={handleChange("address")} />
              </div>
              <div className="form-group">
                <label className="form-label">Logo URL</label>
                <input className="form-input" value={form.logoUrl} onChange={handleChange("logoUrl")} />
              </div>
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" value={form.description} onChange={handleChange("description")} rows={3} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Creando..." : "Crear Club"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setFormError(""); }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="catalog-filters">
        <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
          <label className="form-label sr-only" htmlFor="search">
            Buscar club
          </label>
          <input
            id="search"
            type="search"
            className="form-input"
            placeholder="Buscar por nombre o facultad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-label sr-only" htmlFor="sport">
            Filtrar por deporte
          </label>
          <select
            id="sport"
            className="form-select"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            {sportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="state-message">
          <div className="spinner" />
          <p>Cargando clubes...</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && filteredClubs.length === 0 && (
        <div className="state-message">
          <h3>No se encontraron clubes</h3>
          <p>Intenta con otro término de búsqueda o cambia el filtro de deporte.</p>
        </div>
      )}

      {!loading && filteredClubs.length > 0 && (
        <div className="grid-clubs">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
}