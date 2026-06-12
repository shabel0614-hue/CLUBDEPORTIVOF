import apiClient from "./apiClient";
import type { UserDto, UpdateUserDto } from "../types/auth";

export const userService = {
  getAll: async () => {
    const { data } = await apiClient.get<UserDto[]>("/user");
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<UserDto>(`/user/${id}`);
    return data;
  },
  update: async (id: string, dto: UpdateUserDto) => {
    const { data } = await apiClient.put<UserDto>(`/user/${id}`, dto);
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/user/${id}`);
  },
};