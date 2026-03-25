import { tasks } from "../data/inMemoryDb";
import { TaskStatus } from "../models/task.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { buildPagination } from "../utils/pagination";

const statuses: TaskStatus[] = ["NEW", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"];

const scopedTasks = (currentUser: NonNullable<AuthenticatedRequest["user"]>) => {
  if (currentUser.role === "ADMIN") {
    return [...tasks];
  }

  return tasks.filter(
    (item) => item.createdBy === currentUser.userId || item.assignedTo === currentUser.userId
  );
};

export const reportService = {
  statusSummary: async (currentUser: NonNullable<AuthenticatedRequest["user"]>) => {
    const items = scopedTasks(currentUser);
    return {
      scope: currentUser.role === "ADMIN" ? "global" : "user",
      generatedAt: new Date().toISOString(),
      totalTasks: items.length,
      statusCounts: statuses.map((status) => ({
        status,
        count: items.filter((item) => item.status === status).length
      }))
    };
  },

  overdue: async (
    query: Record<string, unknown>,
    currentUser: NonNullable<AuthenticatedRequest["user"]>
  ) => {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 20);
    const today = new Date().toISOString().slice(0, 10);

    const overdueItems = scopedTasks(currentUser).filter(
      (item) => item.dueDate && item.dueDate < today && item.status !== "COMPLETED"
    );

    const start = (page - 1) * pageSize;
    const data = overdueItems.slice(start, start + pageSize);

    return {
      generatedAt: new Date().toISOString(),
      data,
      pagination: buildPagination(page, pageSize, overdueItems.length)
    };
  },

  productivity: async (
    query: { period: "daily" | "weekly" | "monthly"; fromDate?: string; toDate?: string },
    currentUser: NonNullable<AuthenticatedRequest["user"]>
  ) => {
    const items = scopedTasks(currentUser).filter((item) => item.status === "COMPLETED");
    return {
      scope: currentUser.role === "ADMIN" ? "global" : "user",
      period: query.period,
      fromDate: query.fromDate ?? new Date().toISOString().slice(0, 10),
      toDate: query.toDate ?? new Date().toISOString().slice(0, 10),
      totalCompleted: items.length,
      series: [
        {
          label: new Date().toISOString().slice(0, 10),
          completedCount: items.length
        }
      ]
    };
  },

  trend: async (
    query: { granularity: "day" | "week"; fromDate: string; toDate: string },
    currentUser: NonNullable<AuthenticatedRequest["user"]>
  ) => {
    const items = scopedTasks(currentUser);
    const completed = items.filter((item) => item.status === "COMPLETED").length;

    return {
      scope: currentUser.role === "ADMIN" ? "global" : "user",
      granularity: query.granularity,
      fromDate: query.fromDate,
      toDate: query.toDate,
      points: [
        {
          label: query.granularity === "week" ? "2026-W13" : new Date().toISOString().slice(0, 10),
          createdCount: items.length,
          completedCount: completed
        }
      ]
    };
  }
};
