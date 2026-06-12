import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserDto, LoginDto, RegisterDto } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  updateLocalUser: (user: UserDto) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    const data = await authService.login(credentials);
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (dto: RegisterDto) => {
    await authService.register(dto);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const updateLocalUser = (updatedUser: UserDto) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}