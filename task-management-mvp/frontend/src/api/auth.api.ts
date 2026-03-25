import { LoginResponse } from "../types/api.types";
import { http } from "./http";

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const response = await http.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },
  logout: async () => {
    const response = await http.post<{ message: string }>("/auth/logout", {});
    return response.data;
  }
};
