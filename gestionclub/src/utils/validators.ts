export type Validator = (value: string) => string | null;

export const validators = {
  required: (label: string): Validator => (value) =>
    value.trim() === "" ? `${label} es obligatorio.` : null,

  minLength: (min: number, label: string): Validator => (value) =>
    value.trim().length > 0 && value.trim().length < min
      ? `${label} debe tener al menos ${min} caracteres.`
      : null,

  email: (): Validator => (value) =>
    value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? "Ingresa un correo electrónico válido."
      : null,

  number: (label: string): Validator => (value) =>
    value.trim() !== "" && Number.isNaN(Number(value))
      ? `${label} debe ser un número válido.`
      : null,

  minValue: (min: number, label: string): Validator => (value) =>
    value.trim() !== "" && Number(value) < min
      ? `${label} debe ser mayor o igual a ${min}.`
      : null,

  url: (label: string): Validator => (value) =>
    value.trim() !== "" && !/^https?:\/\/.+/.test(value)
      ? `${label} debe ser una URL válida (http:// o https://).`
      : null,
};

/**
 * Ejecuta una lista de validadores sobre un valor y devuelve el primer error encontrado.
 */
export function runValidators(value: string, rules: Validator[]): string | null {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
}