import apiClient from "./apiClient";
import type { ClubResponseDto, CreateClubDto, UpdateClubDto } from "../types/club";
import type { UserDto } from "../types/auth";

export const clubService = {
  getAll: async () => {
    const { data } = await apiClient.get<ClubResponseDto[]>("/club");
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ClubResponseDto>(`/club/${id}`);
    return data;
  },
  create: async (dto: CreateClubDto) => {
    const { data } = await apiClient.post<ClubResponseDto>("/club", dto);
    return data;
  },
  update: async (id: string, dto: UpdateClubDto) => {
    const { data } = await apiClient.put<ClubResponseDto>(`/club/${id}`, dto);
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/club/${id}`);
  },
  join: async (id: string) => {
    await apiClient.post(`/club/${id}/join`);
  },
  getMembers: async (id: string) => {
    const { data } = await apiClient.get<UserDto[]>(`/club/${id}/members`);
    return data;
  },
};