import apiClient from "./apiClient";
import type { 
  ResourceResponseDto, 
  CreateResourceDto, 
  UpdateResourceDto, 
  ResourceReservationDto 
} from "../types/resource";

export const resourceService = {
  getAll: async () => {
    const { data } = await apiClient.get<ResourceResponseDto[]>("/resource");
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ResourceResponseDto>(`/resource/${id}`);
    return data;
  },

  getByClub: async (clubId: string) => {
    const { data } = await apiClient.get<ResourceResponseDto[]>(`/resource/club/${clubId}`);
    return data;
  },

  create: async (dto: CreateResourceDto) => {
    const { data } = await apiClient.post<ResourceResponseDto>("/resource", dto);
    return data;
  },

  update: async (id: string, dto: UpdateResourceDto) => {
    const { data } = await apiClient.put<ResourceResponseDto>(`/resource/${id}`, dto);
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/resource/${id}`);
  },

  reserve: async (id: string, dto: ResourceReservationDto) => {
    await apiClient.post(`/resource/${id}/reserve`, dto);
  }
};