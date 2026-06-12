import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

// COMPONENTE LAYOUT PUBLICO
export default function PublicLayout() {
  return (
    <div>
      {/* MENU COMPARTIDO */}
      <NavBar />
      {/* CONTENIDO A ACTUALIZAR */}
      <Outlet />
    </div>
  );
}