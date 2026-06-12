import apiClient from "./apiClient";
import type {
  TrainingResponseDto,
  CreateTrainingDto,
  UpdateTrainingDto,
} from "../types/training";

export const trainingService = {
  getAll: async () => {
    const { data } = await apiClient.get<TrainingResponseDto[]>("/training");
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<TrainingResponseDto>(`/training/${id}`);
    return data;
  },
  getByClub: async (clubId: string) => {
    const { data } = await apiClient.get<TrainingResponseDto[]>(`/training/club/${clubId}`);
    return data;
  },
  create: async (dto: CreateTrainingDto) => {
    const { data } = await apiClient.post<TrainingResponseDto>("/training", dto);
    return data;
  },
  update: async (id: string, dto: UpdateTrainingDto) => {
    const { data } = await apiClient.put<TrainingResponseDto>(`/training/${id}`, dto);
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/training/${id}`);
  },
  join: async (id: string) => {
    await apiClient.post(`/training/${id}/join`);
  },
};