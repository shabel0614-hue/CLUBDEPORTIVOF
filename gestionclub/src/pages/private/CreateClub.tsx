import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clubService } from "../../services/clubService";
import type { CreateClubDto } from "../../types/club";

export default function CreateClub() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateClubDto>({
    name: "",
    sportType: "",
    facultyOrArea: "",
    logoUrl: "",
    description: "",
    address: "",
    maxCapacity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    clubService
      .getById(id)
      .then((c) => {
        setForm({
          name: c.name,
          sportType: c.sportType,
          facultyOrArea: c.facultyOrArea,
          logoUrl: c.logoUrl,
          description: c.description,
          address: c.address,
          maxCapacity: c.maxCapacity,
        });
      })
      .catch(() => setError("No se pudo cargar el club."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (k: keyof CreateClubDto, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (id) {
        await clubService.update(id, form);
      } else {
        await clubService.create(form);
      }
      navigate("/clubs");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al guardar el club.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <h1>{id ? "Editar Club" : "Crear Club"}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Deporte</label>
          <input value={form.sportType} onChange={(e) => handleChange("sportType", e.target.value)} className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Facultad / Área</label>
          <input value={form.facultyOrArea} onChange={(e) => handleChange("facultyOrArea", e.target.value)} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Capacidad máxima</label>
          <input type="number" value={form.maxCapacity} onChange={(e) => handleChange("maxCapacity", Number(e.target.value))} className="form-input" />
        </div>

        <div className="form-group form-grid-full">
          <label className="form-label">Dirección</label>
          <input value={form.address} onChange={(e) => handleChange("address", e.target.value)} className="form-input" />
        </div>

        <div className="form-group form-grid-full">
          <label className="form-label">Logo URL</label>
          <input value={form.logoUrl} onChange={(e) => handleChange("logoUrl", e.target.value)} className="form-input" />
        </div>

        <div className="form-group form-grid-full">
          <label className="form-label">Descripción</label>
          <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="form-textarea" rows={4} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
