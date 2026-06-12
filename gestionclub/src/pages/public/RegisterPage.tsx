import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import Seo from "../../components/Seo";
import { validators, runValidators } from "../../utils/validators";
import "../../App.css";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  institutionalCode: string;
  memberType: string;
  academicUnit: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const MEMBER_TYPES = ["Estudiante", "Docente", "Administrativo"];
const ACADEMIC_UNITS = [
  "Sistemas",
  "Ingeniería Civil",
  "Ingeniería Industrial",
  "Medicina",
  "Derecho",
  "Administración de Empresas",
  "Arquitectura",
  "Comunicación",
];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    institutionalCode: "",
    memberType: MEMBER_TYPES[0],
    academicUnit: ACADEMIC_UNITS[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: runValidators(form.name, [
        validators.required("El nombre"),
        validators.minLength(3, "El nombre"),
      ]) ?? undefined,
      email:
        runValidators(form.email, [validators.required("El correo"), validators.email()]) ??
        undefined,
      password:
        runValidators(form.password, [
          validators.required("La contraseña"),
          validators.minLength(6, "La contraseña"),
        ]) ?? undefined,
      confirmPassword:
        form.confirmPassword !== form.password ? "Las contraseñas no coinciden." : undefined,
      institutionalCode:
        runValidators(form.institutionalCode, [
          validators.required("El código institucional"),
          validators.minLength(4, "El código institucional"),
        ]) ?? undefined,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "Usuario",
        institutionalCode: form.institutionalCode,
        memberType: form.memberType,
        academicUnit: form.academicUnit,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data ||
          "No se pudo completar el registro. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Seo
        title="Crear cuenta"
        description="Crea tu cuenta en Impulse Club y forma parte de los clubes deportivos de tu universidad."
      />

      <div className="auth-card card-wide">
        {/* ── Left: Form ── */}
        <div className="form-wrapper">
          <h1 className="auth-title">Crea tu cuenta</h1>
          <p className="auth-subtitle">
            Únete a la comunidad deportiva universitaria en segundos.
          </p>

          {serverError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {serverError}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="status">
              ✅ ¡Registro exitoso! Redirigiendo al inicio de sesión...
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? "input-error" : ""}`}
                placeholder="Tu nombre completo"
                value={form.name}
                onChange={handleChange("name")}
                autoComplete="name"
              />
              {errors.name && <span className="form-error">⚠️ {errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  placeholder="tu@correo.edu.bo"
                  value={form.email}
                  onChange={handleChange("email")}
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">⚠️ {errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="institutionalCode">Código institucional</label>
                <input
                  id="institutionalCode"
                  type="text"
                  className={`form-input ${errors.institutionalCode ? "input-error" : ""}`}
                  placeholder="Ej: 20220001"
                  value={form.institutionalCode}
                  onChange={handleChange("institutionalCode")}
                />
                {errors.institutionalCode && (
                  <span className="form-error">⚠️ {errors.institutionalCode}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  className={`form-input ${errors.password ? "input-error" : ""}`}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange("password")}
                  autoComplete="new-password"
                />
                {errors.password && <span className="form-error">⚠️ {errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                  placeholder="Repite tu contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="form-error">⚠️ {errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="memberType">Tipo de miembro</label>
                <select
                  id="memberType"
                  className="form-select"
                  value={form.memberType}
                  onChange={handleChange("memberType")}
                >
                  {MEMBER_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="academicUnit">Unidad académica</label>
                <select
                  id="academicUnit"
                  className="form-select"
                  value={form.academicUnit}
                  onChange={handleChange("academicUnit")}
                >
                  {ACADEMIC_UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: 8 }}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta →"
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>

        {/* ── Right: Visual panel ── */}
        <div className="auth-visual" aria-hidden="true">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">🏆</div>
            <h2>Únete hoy</h2>
            <p>
              Forma parte de una comunidad de atletas universitarios comprometidos con el
              deporte y la excelencia.
            </p>
            <div className="auth-visual-dots">
              <div className="auth-visual-dot" />
              <div className="auth-visual-dot active" />
              <div className="auth-visual-dot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}