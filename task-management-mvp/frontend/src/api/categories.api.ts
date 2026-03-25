import { Category, CategoryListResponse } from "../types/api.types";
import { http } from "./http";

export const categoriesApi = {
  list: async (params: Record<string, unknown>) => {
    const response = await http.get<CategoryListResponse>("/categories", { params });
    return response.data;
  },
  create: async (payload: { name: string; description?: string | null; isActive?: boolean }) => {
    const response = await http.post<Category>("/categories", payload);
    return response.data;
  },
  update: async (
    categoryId: string,
    payload: { name?: string; description?: string | null; isActive?: boolean }
  ) => {
    const response = await http.put<Category>(`/categories/${categoryId}`, payload);
    return response.data;
  },
  remove: async (categoryId: string) => {
    await http.delete(`/categories/${categoryId}`);
  }
};
