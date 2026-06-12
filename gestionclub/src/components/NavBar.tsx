import { NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Brand from "./Brand";
import ThemeToggle from "./Temetoggle";
import "../App.css";

type NavLinkItem = {
  to: string;
  label: string;
  end?: boolean;
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinks = useMemo<NavLinkItem[]>(() => {
    if (!isAuthenticated) {
      return [
        { to: "/", label: "Inicio", end: true },
        { to: "/clubs", label: "Clubes" },
      ];
    }

    const links: NavLinkItem[] = [
  { to: "/dashboard", label: "Mi Panel" },
  { to: "/clubs", label: "Clubes" },
  { to: "/trainings", label: "Entrenamientos" },
  { to: "/resources", label: "Recursos" },
];

// Aquí realizamos el cambio para incluir al Fundador
if (user?.role === "Admin" || user?.role === "Fundador") {
  links.push({ to: "/admin/dashboard", label: "Gestión" });
}

    return links;
  }, [isAuthenticated, user?.role]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Brand to={isAuthenticated ? "/dashboard" : "/"} />

        <button
          className="navbar-burger"
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="nav-link"
              onClick={closeMenu}
              end={link.end}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="navbar-actions">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="nav-link nav-user" onClick={closeMenu}>
                  <span className={`badge badge-role-${roleClass(user?.role)}`}>
                    {user?.role}
                  </span>
                  <span className="nav-user-name">{user?.name?.split(" ")[0]}</span>
                </NavLink>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>
                  Iniciar sesión
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function roleClass(role?: string) {
  switch (role) {
    case "Admin":
      return "admin";
    case "Fundador":
      return "fundador";
    default:
      return "usuario";
  }
}