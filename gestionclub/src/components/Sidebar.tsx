import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside style={{ width: "200px", borderRight: "1px solid #ccc" }}>
      <nav>
        <Link to="/dashboard">Mis Clubes</Link>
        <Link to="/clubs">Explorar Clubes</Link>
        
        {/* Solo Fundador o Admin */}
        {(user?.role === "Fundador" || user?.role === "Admin") && (
          <Link to="/clubs/new">Gestionar mi Club</Link>
        )}

        {/* Solo Admin */}
        {user?.role === "Admin" && (
          <Link to="/admin/dashboard">Panel Admin</Link>
        )}
      </nav>
    </aside>
  );
}