import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { trainingService } from "../../services/trainingService";
import type { TrainingResponseDto } from "../../types/training";

export default function TrainingsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<TrainingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainingService.getAll().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const canCreate = useMemo(
    () => user?.role === "Admin" || user?.role === "Fundador",
    [user?.role]
  );

  return (
    <div className="page-shell">
      <div className="section-header">
        <h1>Entrenamientos</h1>
        {canCreate && (
          <Link to="/trainings/new" className="btn btn-primary btn-sm">
            + Nuevo
          </Link>
        )}
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid-mini">
          {items.map((t) => (
            <div key={t.id} className="mini-card">
              <h3>{t.name}</h3>
              <p>{new Date(t.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
