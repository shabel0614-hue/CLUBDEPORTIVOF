import { Link } from "react-router-dom";
import "../App.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span style={{ fontSize: "1.3rem" }}>⚡</span>
              Impulse<span>Club</span>
            </div>
            <p>
              La plataforma oficial para descubrir, gestionar y unirte a los clubes
              deportivos de tu universidad.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="footer-col-title">Plataforma</p>
            <ul className="footer-col-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/clubs">Explorar clubes</Link></li>
              <li><Link to="/trainings">Entrenamientos</Link></li>
              <li><Link to="/resources">Recursos</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="footer-col-title">Cuenta</p>
            <ul className="footer-col-links">
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/register">Registrarse</Link></li>
              <li><Link to="/dashboard">Mi panel</Link></li>
              <li><Link to="/profile">Mi perfil</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="footer-col-title">Información</p>
            <ul className="footer-col-links">
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Política de privacidad</a></li>
              <li><a href="#">Términos de uso</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Impulse Club Universitario. Todos los derechos reservados.
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="Instagram" data-tooltip="Instagram">
              📸
            </a>
            <a href="#" className="footer-social-link" aria-label="Twitter/X" data-tooltip="Twitter">
              🐦
            </a>
            <a href="#" className="footer-social-link" aria-label="Facebook" data-tooltip="Facebook">
              👥
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}