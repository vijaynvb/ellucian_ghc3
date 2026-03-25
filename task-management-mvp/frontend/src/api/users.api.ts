import { User, UserListResponse } from "../types/api.types";
import { http } from "./http";

export const usersApi = {
  list: async (params: Record<string, unknown>) => {
    const response = await http.get<UserListResponse>("/users", { params });
    return response.data;
  },
  create: async (payload: { email: string; password: string; role: "END_USER" | "ADMIN"; status?: "ACTIVE" | "INACTIVE" }) => {
    const response = await http.post<User>("/users", payload);
    return response.data;
  },
  getById: async (userId: string) => {
    const response = await http.get<User>(`/users/${userId}`);
    return response.data;
  },
  update: async (userId: string, payload: { role?: "END_USER" | "ADMIN"; status?: "ACTIVE" | "INACTIVE" }) => {
    const response = await http.patch<User>(`/users/${userId}`, payload);
    return response.data;
  }
};
