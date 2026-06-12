import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import Seo from "../../components/Seo";
import "../../App.css";

export default function ProfilePage() {
  const { user, updateLocalUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    profilePictureUrl: user?.profilePictureUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMsg(null);
    try {
      const updated = await userService.update(user.id, {
        name: form.name,
        phoneNumber: form.phoneNumber,
        profilePictureUrl: form.profilePictureUrl,
      });
      updateLocalUser(updated);
      setMsg({ type: "success", text: "✅ Perfil actualizado correctamente." });
    } catch (err: any) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Error al actualizar." });
    } finally {
      setSaving(false);
    }
  };

  // Initials fallback
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <>
      <Seo title="Mi perfil" description="Página de perfil del usuario" />
      <div className="profile-dashboard-layout">
        
        {/* Sidebar: Información de Identidad */}
        <div className="profile-side-card">
          <div className={`profile-role-badge badge-role-${roleClass(user?.role)}`}>
            {user?.role || "USUARIO"}
          </div>
          <div className="profile-avatar-wrap">
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="Avatar" className="profile-avatar-large" />
            ) : (
              <div className="profile-avatar-initials-large">{initials}</div>
            )}
            <span className="profile-status-dot-large" />
          </div>
          <h2 className="profile-name-side">{user?.name}</h2>
          <p className="profile-email-side">{user?.email}</p>
        </div>

        {/* Main: Formulario de edición */}
        <div className="profile-form-card">
          <div className="card-header">
            <h2>Información de contacto</h2>
          </div>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input className="form-input" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" value={form.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)} />
              </div>
              <div className="form-group form-grid-full">
                <label className="form-label">Foto de perfil (URL)</label>
                <input className="form-input" value={form.profilePictureUrl} onChange={(e) => handleChange("profilePictureUrl", e.target.value)} />
              </div>
            </div>

            <div className="field-actions">
              <button type="button" className="btn-link" onClick={() => setForm({ name: user?.name || "", phoneNumber: user?.phoneNumber || "", profilePictureUrl: user?.profilePictureUrl || "" })}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function roleClass(role?: string) {
  switch (role) {
    case "Admin": return "admin";
    case "Fundador": return "fundador";
    default: return "usuario";
  }

}