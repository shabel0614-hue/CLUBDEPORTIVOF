import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import "../App.css";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <Seo
        title="Página no encontrada"
        description="La página que buscas no existe o fue movida."
      />
      <p className="not-found-code" aria-hidden="true">404</p>
      <h1>Esta cancha no existe</h1>
      <p className="not-found-text">
        La página que buscas no está disponible. Puede que el enlace esté roto o que la página
        haya sido movida.
      </p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        <Link to="/clubs" className="btn btn-secondary">
          Ver clubes
        </Link>
      </div>
    </div>
  );
}