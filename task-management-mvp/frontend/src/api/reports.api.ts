import { http } from "./http";

export const reportsApi = {
  statusSummary: async () => {
    const response = await http.get("/reports/status-summary");
    return response.data;
  },
  overdue: async (params: { page?: number; pageSize?: number }) => {
    const response = await http.get("/reports/overdue", { params });
    return response.data;
  },
  productivity: async (params: { period: "daily" | "weekly" | "monthly"; fromDate?: string; toDate?: string }) => {
    const response = await http.get("/reports/productivity", { params });
    return response.data;
  },
  trend: async (params: { granularity: "day" | "week"; fromDate: string; toDate: string }) => {
    const response = await http.get("/reports/trend", { params });
    return response.data;
  }
};
