import apiClient from "./apiClient";
import type { LoginDto, LoginResponseDto, RegisterDto } from "../types/auth";

export const authService = {
  login: async (credentials: LoginDto) => {
    const { data } = await apiClient.post<LoginResponseDto>("/auth/login", credentials);
    return data;
  },
  register: async (dto: RegisterDto) => {
    const { data } = await apiClient.post("/auth/register", dto);
    return data;
  },
  refresh: async (refreshToken: string) => {
    const { data } = await apiClient.post<LoginResponseDto>("/auth/refresh", { refreshToken });
    return data;
  },
};