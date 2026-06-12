import { Link } from "react-router-dom";
import "../App.css";

export default function Brand({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="brand" aria-label="Impulse Club, ir al inicio">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="22" height="22">
          <path
            fill="currentColor"
            d="M16 1.5 29.5 8v16L16 30.5 2.5 24V8L16 1.5Z"
            opacity="0.18"
          />
          <path
            fill="currentColor"
            d="M16 6 24 10v10l-8 4-8-4V10l8-4Zm0 2.4-5.9 2.95v9.3L16 23.6l5.9-2.95v-9.3L16 8.4Z"
          />
          <circle cx="16" cy="16" r="2.6" fill="currentColor" />
        </svg>
      </span>
      <span className="brand-name">
        Impulse<span className="brand-accent">Club</span>
      </span>
    </Link>
  );
}