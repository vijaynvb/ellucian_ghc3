"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidation = void 0;
const zod_1 = require("zod");
const taskStatus = zod_1.z.enum(["NEW", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"]);
const taskPriority = zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]);
exports.taskValidation = {
    listTasks: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().int().min(1).optional(),
            pageSize: zod_1.z.coerce.number().int().min(1).max(100).optional(),
            status: taskStatus.optional(),
            assigneeUserId: zod_1.z.string().optional(),
            priority: taskPriority.optional(),
            dueDateFrom: zod_1.z.string().date().optional(),
            dueDateTo: zod_1.z.string().date().optional(),
            sortBy: zod_1.z.enum(["createdAt", "dueDate", "priority", "status"]).optional(),
            sortOrder: zod_1.z.enum(["asc", "desc"]).optional()
        }),
        body: zod_1.z.object({}).optional(),
        params: zod_1.z.object({}).optional()
    }),
    createTask: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(3).max(120),
            description: zod_1.z.string().max(2000).nullable().optional(),
            priority: taskPriority.optional(),
            dueDate: zod_1.z.string().date().nullable().optional(),
            assignedTo: zod_1.z.string().nullable().optional()
        }),
        query: zod_1.z.object({}).optional(),
        params: zod_1.z.object({}).optional()
    }),
    taskById: zod_1.z.object({
        params: zod_1.z.object({ taskId: zod_1.z.string().min(1) }),
        query: zod_1.z.object({}).optional(),
        body: zod_1.z.object({}).optional()
    }),
    updateTask: zod_1.z.object({
        params: zod_1.z.object({ taskId: zod_1.z.string().min(1) }),
        body: zod_1.z
            .object({
            title: zod_1.z.string().min(3).max(120).optional(),
            description: zod_1.z.string().max(2000).nullable().optional(),
            priority: taskPriority.optional(),
            dueDate: zod_1.z.string().date().nullable().optional()
        })
            .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
        query: zod_1.z.object({}).optional()
    }),
    updateStatus: zod_1.z.object({
        params: zod_1.z.object({ taskId: zod_1.z.string().min(1) }),
        body: zod_1.z.object({ status: taskStatus }),
        query: zod_1.z.object({}).optional()
    }),
    updateAssignee: zod_1.z.object({
        params: zod_1.z.object({ taskId: zod_1.z.string().min(1) }),
        body: zod_1.z.object({ assignedTo: zod_1.z.string().min(1) }),
        query: zod_1.z.object({}).optional()
    })
};
