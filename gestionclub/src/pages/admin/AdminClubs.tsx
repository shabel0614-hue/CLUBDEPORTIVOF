import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clubService } from '../../services/clubService';
import type { ClubResponseDto, CreateClubDto, UpdateClubDto } from '../../types/club';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import ConfirmDialog from '../../components/ConfirmDialog';

type ClubForm = {
  name: string; sportType: string; facultyOrArea: string;
  logoUrl: string; description: string; address: string; maxCapacity: string;
};

const EMPTY: ClubForm = { name: '', sportType: '', facultyOrArea: '', logoUrl: '', description: '', address: '', maxCapacity: '' };

function validate(form: ClubForm) {
  const e: Partial<Record<keyof ClubForm, string>> = {};
  if (!form.name.trim()) e.name = 'El nombre es obligatorio.';
  if (!form.sportType.trim()) e.sportType = 'El deporte es obligatorio.';
  if (!form.facultyOrArea.trim()) e.facultyOrArea = 'La facultad es obligatoria.';
  if (!form.maxCapacity || isNaN(Number(form.maxCapacity)) || Number(form.maxCapacity) < 1) e.maxCapacity = 'Capacidad inválida.';
  return e;
}

export default function AdminClubs() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<ClubResponseDto[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ClubResponseDto | null>(null);
  const [form, setForm] = useState<ClubForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ClubForm, string>>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
  if (loading) return;
  // Permitimos el acceso a ambos
  if (user?.role !== 'Admin' && user?.role !== 'Fundador') { 
    navigate('/dashboard'); 
    return; 
  }
  load();
}, [user, loading, navigate]);

  const load = () => {
    setLoadingClubs(true);
    clubService.getAll()
      .then(setClubs)
      .catch(() => setFeedback({ type: 'error', msg: 'Error al cargar clubes.' }))
      .finally(() => setLoadingClubs(false));
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setErrors({}); setShowModal(true); };
  const openEdit = (c: ClubResponseDto) => {
    setEditing(c);
    setForm({ name: c.name, sportType: c.sportType, facultyOrArea: c.facultyOrArea || '', logoUrl: c.logoUrl || '', description: c.description || '', address: c.address || '', maxCapacity: String(c.maxCapacity) });
    setErrors({});
    setShowModal(true);
  };

  const set = (field: keyof ClubForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = { name: form.name, sportType: form.sportType, facultyOrArea: form.facultyOrArea, logoUrl: form.logoUrl, description: form.description, address: form.address, maxCapacity: Number(form.maxCapacity) };
    try {
      if (editing) {
        await clubService.update(editing.id, payload as UpdateClubDto);
        setFeedback({ type: 'success', msg: '✅ Club actualizado.' });
      } else {
        await clubService.create(payload as CreateClubDto);
        setFeedback({ type: 'success', msg: '✅ Club creado.' });
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err?.response?.data?.message || 'Error al guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await clubService.delete(deleteTarget);
      setFeedback({ type: 'success', msg: '✅ Club eliminado.' });
      load();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar el club.' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = clubs.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.sportType.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="state-message">
      <div className="spinner" />
      <p>Verificando permisos...</p>
    </div>
  );

  return (
    <>
      <Seo title="Admin - Gestión de Clubes" description="Panel de administración de clubes deportivos." />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar este club"
        message="Esta acción es permanente y no se puede deshacer."
        onConfirm={() => { void handleDelete(); }}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Sí, eliminar"
      />

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Editar Club' : 'Crear Club'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <form onSubmit={handleSave} noValidate>
              <div className="form-grid-2">
                {([
                  { id: 'name', label: 'Nombre *', placeholder: 'Club de Fútbol...', required: true },
                  { id: 'sportType', label: 'Deporte *', placeholder: 'Fútbol, Baloncesto...', required: true },
                  { id: 'facultyOrArea', label: 'Facultad *', placeholder: 'Facultad de Tecnología...', required: true },
                  { id: 'maxCapacity', label: 'Capacidad *', placeholder: '50', required: true, type: 'number' },
                  { id: 'address', label: 'Dirección', placeholder: 'Dirección del club', required: false },
                  { id: 'logoUrl', label: 'URL Logo', placeholder: 'https://...', required: false },
                ] as const).map((f) => {
                  const item = f as any;
                  const id = item.id as string;
                  const label = item.label as string;
                  const placeholder = item.placeholder as string;
                  const required = !!item.required;
                  const inputType = (item.type as string) || 'text';
                  return (
                    <div key={id} className="form-group">
                      <label htmlFor={`modal-${id}`} className="form-label">{label}</label>
                      <input
                        id={`modal-${id}`}
                        type={inputType}
                        className={`form-input ${(errors as any)[id] ? 'error' : ''}`}
                        placeholder={placeholder}
                        value={(form as any)[id]}
                        onChange={set(id as keyof ClubForm)}
                        required={required}
                      />
                      {(errors as any)[id] && <span className="form-error">⚠️ {(errors as any)[id]}</span>}
                    </div>
                  );
                })}
                <div className="form-group form-grid-full">
                  <label htmlFor="modal-desc" className="form-label">Descripción</label>
                  <textarea id="modal-desc" className="form-textarea" placeholder="Descripción del club..." value={form.description} onChange={set('description')} rows={3} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Guardando...</> : editing ? '💾 Actualizar' : '✅ Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Clubes</h1>
          <p className="page-subtitle">{filtered.length} club{filtered.length !== 1 ? 'es' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Crear Club</button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`} style={{ marginBottom: 16 }}>
          {feedback.msg}
          <button onClick={() => setFeedback(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}>✕</button>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input type="search" className="form-input" placeholder="🔍 Buscar clubes..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Buscar clubs" style={{ maxWidth: 360 }} />
      </div>

      {loadingClubs ? (
        <div className="loading-screen"><div className="spinner" /><p>Cargando...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏟️</div>
          <h3 className="empty-state-title">No hay clubes</h3>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openCreate}>Crear el primero</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table" aria-label="Lista de clubes">
            <thead>
              <tr>
                <th>Club</th>
                <th>Deporte</th>
                <th>Facultad</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(club => (
                <tr key={club.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={club.logoUrl || 'https://placehold.co/36x36/0d1b2a/00c6ff?text=⚡'}
                        alt={`Logo ${club.name}`}
                        style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/36x36/0d1b2a/00c6ff?text=⚡'; }}
                      />
                      <span style={{ fontWeight: 600 }}>{club.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{club.sportType}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{club.facultyOrArea || '—'}</td>
                  <td>{club.maxCapacity}</td>
                  <td>
                    <span className={`badge ${club.isApproved ? 'badge-green' : 'badge-yellow'}`}>
                      {club.isApproved ? '✓ Aprobado' : '⏳ Pendiente'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(club)} aria-label={`Editar ${club.name}`}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(club.id)} aria-label={`Eliminar ${club.name}`}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
