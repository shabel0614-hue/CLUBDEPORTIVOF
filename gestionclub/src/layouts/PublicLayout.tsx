import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// COMPONENTE LAYOUT PUBLICO
export default function PublicLayout() {
  return (
    <div>
      {/* MENU COMPARTIDO */}
      <NavBar />
      {/* CONTENIDO A ACTUALIZAR */}
      <Outlet />
      <Footer />
    </div>
  );
}