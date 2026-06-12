import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Seo from "../../components/Seo";
import { validators, runValidators } from "../../utils/validators";
import "../../App.css";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      email: runValidators(form.email, [validators.required("El correo"), validators.email()]) ?? undefined,
      password: runValidators(form.password, [
        validators.required("La contraseña"),
        validators.minLength(6, "La contraseña"),
      ]) ?? undefined,
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      const redirectTo =
        (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data ||
          "Correo o contraseña incorrectos. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Seo
        title="Iniciar sesión"
        description="Inicia sesión en Impulse Club para gestionar y unirte a clubes deportivos universitarios."
      />

      <div className="auth-card">
        {/* ── Left: Form ── */}
        <div className="form-wrapper">
          <h1 className="auth-title">Bienvenido de vuelta</h1>
          <p className="auth-subtitle">
            Ingresa a tu cuenta para gestionar tus clubes y entrenamientos.
          </p>

          {serverError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="tu@correo.edu.bo"
                value={form.email}
                onChange={handleChange("email")}
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="form-error">⚠️ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange("password")}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
              />
              {errors.password && <span className="form-error">⚠️ {errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Ingresando...
                </>
              ) : (
                "Iniciar sesión →"
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿No tienes una cuenta? <Link to="/register">Regístrate gratis</Link>
          </p>
        </div>

        {/* ── Right: Visual panel ── */}
        <div className="auth-visual" aria-hidden="true">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">⚡</div>
            <h2>Impulse Club</h2>
            <p>
              Conecta con los mejores clubes deportivos de tu universidad y lleva tu potencial
              al siguiente nivel.
            </p>
            <div className="auth-visual-dots">
              <div className="auth-visual-dot active" />
              <div className="auth-visual-dot" />
              <div className="auth-visual-dot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}