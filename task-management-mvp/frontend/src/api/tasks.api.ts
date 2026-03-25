import { Task, TaskListResponse, TaskStatus } from "../types/api.types";
import { http } from "./http";

export const tasksApi = {
  list: async (params: Record<string, unknown>) => {
    const response = await http.get<TaskListResponse>("/tasks", { params });
    return response.data;
  },
  getById: async (taskId: string) => {
    const response = await http.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },
  create: async (payload: {
    title: string;
    description?: string | null;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string | null;
    assignedTo?: string | null;
    categoryId?: string | null;
  }) => {
    const response = await http.post<Task>("/tasks", payload);
    return response.data;
  },
  update: async (
    taskId: string,
    payload: {
      title?: string;
      description?: string | null;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      dueDate?: string | null;
      categoryId?: string | null;
    }
  ) => {
    const response = await http.patch<Task>(`/tasks/${taskId}`, payload);
    return response.data;
  },
  updateStatus: async (taskId: string, status: TaskStatus) => {
    const response = await http.patch<Task>(`/tasks/${taskId}/status`, { status });
    return response.data;
  },
  assign: async (taskId: string, assignedTo: string) => {
    const response = await http.patch<Task>(`/tasks/${taskId}/assignee`, { assignedTo });
    return response.data;
  }
};
