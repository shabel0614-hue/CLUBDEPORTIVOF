import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

// COMPONENTE LAYOUT PRIVADO
export default function PrivateLayout() {
  return (
    <div>
      {/* MENU COMPARTIDO */}
      <NavBar />
      {/* CONTENIDO A ACTUALIZAR */}
      <Outlet />
    </div>
  );
}