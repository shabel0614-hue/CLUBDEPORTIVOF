import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Añadimos useNavigate
import { useAuth } from "../../context/AuthContext";
import { resourceService } from "../../services/resourceService";
import type { ResourceResponseDto } from "../../types/resource";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function ResourcesPage() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Hook para navegación
  const [items, setItems] = useState<ResourceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    resourceService.getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await resourceService.delete(deleteTarget);
      setItems(prev => prev.filter(i => i.id !== deleteTarget));
    } catch (err) {
      console.error("Error al eliminar", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const canEdit = useMemo(() => user?.role === "Admin" || user?.role === "Fundador", [user?.role]);

  return (
    <div className="page-shell">
      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar recurso"
        message="¿Estás seguro de que deseas eliminar este recurso?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Eliminar"
      />

      <div className="section-header">
        <h1>Recursos</h1>
        {canEdit && (
          <Link to="/resources/new" className="btn btn-primary btn-sm">+ Nuevo</Link>
        )}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid-mini">
          {items.map((r) => (
            <div key={r.id} className="mini-card">
              <h3>{r.name}</h3>
              <p>{r.type} — {r.campus}</p>
              
              {canEdit && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {/* Botón Editar: Redirige al formulario de edición */}
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => navigate(`/resources/edit/${r.id}`)}
                  >
                    Editar
                  </button>
                  
                  {/* Botón Borrar */}
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => setDeleteTarget(r.id)}
                  >
                    Borrar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}