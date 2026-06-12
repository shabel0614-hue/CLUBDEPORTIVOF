import type { UserDto } from "../types/auth";

const STORAGE_KEYS = {
  TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

// Verifica si el usuario tiene una sesión activa (token presente)

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Guarda la información del usuario y los tokens tras el login
 
export const saveAuthData = (user: UserDto, accessToken: string, refreshToken: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

// Obtiene el usuario guardado en el localStorage
export const getUser = (): UserDto | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Cierra la sesión eliminando toda la información de autenticación
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  // Opcional: Redirigir al login si estás en un entorno de navegador
  window.location.href = "/login";
};

// Obtiene los tokens para usarlos en el interceptor de Axios
export const getTokens = () => {
  return {
    accessToken: localStorage.getItem(STORAGE_KEYS.TOKEN),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  };
};