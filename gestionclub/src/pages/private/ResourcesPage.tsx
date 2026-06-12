import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { resourceService } from "../../services/resourceService";
import type { ResourceResponseDto } from "../../types/resource";
import ConfirmDialog from "../../components/ConfirmDialog"; // Asegúrate de importar esto

export default function ResourcesPage() {
  const { user } = useAuth();
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

  const canCreate = useMemo(() => user?.role === "Admin" || user?.role === "Fundador", [user?.role]);

  return (
    <div className="page-shell">
      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar recurso"
        message="¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Eliminar"
      />

      <div className="section-header">
        <h1>Recursos</h1>
        {canCreate && (
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
              
              {/* Botón de borrar solo visible si es Admin/Fundador */}
              {canCreate && (
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => setDeleteTarget(r.id)}
                  style={{ marginTop: '10px' }}
                >
                  Borrar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}