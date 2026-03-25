import { categories, tasks, users } from "../data/inMemoryDb";
import { Task, TaskPriority, TaskStatus } from "../models/task.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { AppError } from "../utils/appError";
import { buildPagination } from "../utils/pagination";

const terminalStatuses: TaskStatus[] = ["COMPLETED", "CANCELLED"];

const resolveCategory = (categoryId?: string | null): void => {
  if (categoryId === undefined || categoryId === null) {
    return;
  }

  const category = categories.find((item) => item.categoryId === categoryId);
  if (!category || !category.isActive) {
    throw new AppError("BAD_REQUEST", 400, "categoryId must reference an ACTIVE category.");
  }
};

const canAccessTask = (task: Task, currentUser: NonNullable<AuthenticatedRequest["user"]>): boolean => {
  if (currentUser.role === "ADMIN") {
    return true;
  }
  return task.createdBy === currentUser.userId || task.assignedTo === currentUser.userId;
};

const enforceTaskAccess = (task: Task, currentUser: NonNullable<AuthenticatedRequest["user"]>): void => {
  if (!canAccessTask(task, currentUser)) {
    throw new AppError("FORBIDDEN", 403, "You do not have access to this task.");
  }
};

const assertValidTransition = (current: TaskStatus, next: TaskStatus): void => {
  const map: Record<TaskStatus, TaskStatus[]> = {
    NEW: ["IN_PROGRESS", "BLOCKED", "CANCELLED"],
    IN_PROGRESS: ["BLOCKED", "COMPLETED", "CANCELLED"],
    BLOCKED: ["IN_PROGRESS", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: []
  };

  if (current === next) {
    return;
  }

  if (!map[current].includes(next)) {
    throw new AppError("BAD_REQUEST", 400, `Invalid lifecycle transition ${current} -> ${next}.`);
  }
};

export const taskService = {
  list: async (query: Record<string, unknown>, currentUser: NonNullable<AuthenticatedRequest["user"]>) => {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 20);

    let filtered = [...tasks];

    if (currentUser.role === "END_USER") {
      filtered = filtered.filter(
        (item) => item.createdBy === currentUser.userId || item.assignedTo === currentUser.userId
      );
    }

    if (query.status) {
      filtered = filtered.filter((item) => item.status === query.status);
    }
    if (query.assigneeUserId) {
      filtered = filtered.filter((item) => item.assignedTo === query.assigneeUserId);
    }
    if (query.priority) {
      filtered = filtered.filter((item) => item.priority === query.priority);
    }
    if (query.categoryId) {
      filtered = filtered.filter((item) => item.categoryId === query.categoryId);
    }

    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      data,
      pagination: buildPagination(page, pageSize, filtered.length)
    };
  },

  create: async (
    payload: {
      title: string;
      description?: string | null;
      priority?: TaskPriority;
      dueDate?: string | null;
      assignedTo?: string | null;
      categoryId?: string | null;
    },
    currentUser: NonNullable<AuthenticatedRequest["user"]>
  ) => {
    resolveCategory(payload.categoryId);

    if (payload.assignedTo) {
      const assignee = users.find((item) => item.userId === payload.assignedTo && item.status === "ACTIVE");
      if (!assignee) {
        throw new AppError("BAD_REQUEST", 400, "assignedTo must reference an ACTIVE user.");
      }
    }

    const now = new Date().toISOString();
    const task: Task = {
      taskId: `tsk_${1000 + tasks.length + 1}`,
      title: payload.title,
      description: payload.description ?? null,
      priority: payload.priority ?? "MEDIUM",
      status: "NEW",
      dueDate: payload.dueDate ?? null,
      categoryId: payload.categoryId ?? null,
      createdBy: currentUser.userId,
      assignedTo: payload.assignedTo ?? null,
      createdAt: now,
      updatedAt: now,
      completedAt: null
    };

    tasks.push(task);
    return task;
  },

  getById: async (taskId: string, currentUser: NonNullable<AuthenticatedRequest["user"]>) => {
    const task = tasks.find((item) => item.taskId === taskId);
    if (!task) {
      throw new AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
    }

    enforceTaskAccess(task, currentUser);
    return task;
  },

  update: async (
    taskId: string,
    payload: {
      title?: string;
      description?: string | null;
      priority?: TaskPriority;
      dueDate?: string | null;
      categoryId?: string | null;
    },
    currentUser: NonNullable<AuthenticatedRequest["user"]>
  ) => {
    const task = tasks.find((item) => item.taskId === taskId);
    if (!task) {
      throw new AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
    }

    enforceTaskAccess(task, currentUser);

    if (terminalStatuses.includes(task.status)) {
      throw new AppError("BAD_REQUEST", 400, "Terminal tasks are read-only in v1.");
    }

    if (payload.title !== undefined) task.title = payload.title;
    if (payload.description !== undefined) task.description = payload.description;
    if (payload.priority !== undefined) task.priority = payload.priority;
    if (payload.dueDate !== undefined) task.dueDate = payload.dueDate;
    if (payload.categoryId !== undefined) {
      resolveCategory(payload.categoryId);
      task.categoryId = payload.categoryId ?? null;
    }

    task.updatedAt = new Date().toISOString();
    return task;
  },

  updateStatus: async (
    taskId: string,
    status: TaskStatus,
    currentUser: NonNullable<AuthenticatedRequest["user"]>
  ) => {
    const task = tasks.find((item) => item.taskId === taskId);
    if (!task) {
      throw new AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
    }

    enforceTaskAccess(task, currentUser);
    assertValidTransition(task.status, status);

    task.status = status;
    task.updatedAt = new Date().toISOString();
    task.completedAt = status === "COMPLETED" ? task.updatedAt : null;

    return task;
  },

  updateAssignee: async (
    taskId: string,
    assignedTo: string,
    currentUser: NonNullable<AuthenticatedRequest["user"]>
  ) => {
    const task = tasks.find((item) => item.taskId === taskId);
    if (!task) {
      throw new AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
    }

    enforceTaskAccess(task, currentUser);

    const assignee = users.find((item) => item.userId === assignedTo && item.status === "ACTIVE");
    if (!assignee) {
      throw new AppError("BAD_REQUEST", 400, "assignedTo must reference an ACTIVE user.");
    }

    task.assignedTo = assignedTo;
    task.updatedAt = new Date().toISOString();

    return task;
  }
};
