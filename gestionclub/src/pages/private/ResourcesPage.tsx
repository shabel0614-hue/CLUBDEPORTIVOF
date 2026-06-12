import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { resourceService } from "../../services/resourceService";
import type { ResourceResponseDto } from "../../types/resource";

export default function ResourcesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ResourceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourceService.getAll().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const canCreate = useMemo(
    () => user?.role === "Admin" || user?.role === "Fundador",
    [user?.role]
  );

  return (
    <div className="page-shell">
      <div className="section-header">
        <h1>Recursos</h1>
        {canCreate && (
          <Link to="/resources/new" className="btn btn-primary btn-sm">
            + Nuevo
          </Link>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
