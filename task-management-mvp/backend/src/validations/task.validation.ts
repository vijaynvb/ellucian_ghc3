import { z } from "zod";

const taskStatus = z.enum(["NEW", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"]);
const taskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const taskValidation = {
  listTasks: z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(100).optional(),
      status: taskStatus.optional(),
      assigneeUserId: z.string().optional(),
      priority: taskPriority.optional(),
      categoryId: z.string().min(1).optional(),
      dueDateFrom: z.string().date().optional(),
      dueDateTo: z.string().date().optional(),
      sortBy: z.enum(["createdAt", "dueDate", "priority", "status"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional()
    }),
    body: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  createTask: z.object({
    body: z.object({
      title: z.string().min(3).max(120),
      description: z.string().max(2000).nullable().optional(),
      priority: taskPriority.optional(),
      dueDate: z.string().date().nullable().optional(),
      assignedTo: z.string().nullable().optional(),
      categoryId: z.string().min(1).nullable().optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  taskById: z.object({
    params: z.object({ taskId: z.string().min(1) }),
    query: z.object({}).optional(),
    body: z.object({}).optional()
  }),
  updateTask: z.object({
    params: z.object({ taskId: z.string().min(1) }),
    body: z
      .object({
        title: z.string().min(3).max(120).optional(),
        description: z.string().max(2000).nullable().optional(),
        priority: taskPriority.optional(),
        dueDate: z.string().date().nullable().optional(),
        categoryId: z.string().min(1).nullable().optional()
      })
      .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
    query: z.object({}).optional()
  }),
  updateStatus: z.object({
    params: z.object({ taskId: z.string().min(1) }),
    body: z.object({ status: taskStatus }),
    query: z.object({}).optional()
  }),
  updateAssignee: z.object({
    params: z.object({ taskId: z.string().min(1) }),
    body: z.object({ assignedTo: z.string().min(1) }),
    query: z.object({}).optional()
  })
};
