"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const inMemoryDb_1 = require("../data/inMemoryDb");
const appError_1 = require("../utils/appError");
const pagination_1 = require("../utils/pagination");
const terminalStatuses = ["COMPLETED", "CANCELLED"];
const canAccessTask = (task, currentUser) => {
    if (currentUser.role === "ADMIN") {
        return true;
    }
    return task.createdBy === currentUser.userId || task.assignedTo === currentUser.userId;
};
const enforceTaskAccess = (task, currentUser) => {
    if (!canAccessTask(task, currentUser)) {
        throw new appError_1.AppError("FORBIDDEN", 403, "You do not have access to this task.");
    }
};
const assertValidTransition = (current, next) => {
    const map = {
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
        throw new appError_1.AppError("BAD_REQUEST", 400, `Invalid lifecycle transition ${current} -> ${next}.`);
    }
};
exports.taskService = {
    list: async (query, currentUser) => {
        const page = Number(query.page ?? 1);
        const pageSize = Number(query.pageSize ?? 20);
        let filtered = [...inMemoryDb_1.tasks];
        if (currentUser.role === "END_USER") {
            filtered = filtered.filter((item) => item.createdBy === currentUser.userId || item.assignedTo === currentUser.userId);
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
        const start = (page - 1) * pageSize;
        const data = filtered.slice(start, start + pageSize);
        return {
            data,
            pagination: (0, pagination_1.buildPagination)(page, pageSize, filtered.length)
        };
    },
    create: async (payload, currentUser) => {
        if (payload.assignedTo) {
            const assignee = inMemoryDb_1.users.find((item) => item.userId === payload.assignedTo && item.status === "ACTIVE");
            if (!assignee) {
                throw new appError_1.AppError("BAD_REQUEST", 400, "assignedTo must reference an ACTIVE user.");
            }
        }
        const now = new Date().toISOString();
        const task = {
            taskId: `tsk_${1000 + inMemoryDb_1.tasks.length + 1}`,
            title: payload.title,
            description: payload.description ?? null,
            priority: payload.priority ?? "MEDIUM",
            status: "NEW",
            dueDate: payload.dueDate ?? null,
            createdBy: currentUser.userId,
            assignedTo: payload.assignedTo ?? null,
            createdAt: now,
            updatedAt: now,
            completedAt: null
        };
        inMemoryDb_1.tasks.push(task);
        return task;
    },
    getById: async (taskId, currentUser) => {
        const task = inMemoryDb_1.tasks.find((item) => item.taskId === taskId);
        if (!task) {
            throw new appError_1.AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
        }
        enforceTaskAccess(task, currentUser);
        return task;
    },
    update: async (taskId, payload, currentUser) => {
        const task = inMemoryDb_1.tasks.find((item) => item.taskId === taskId);
        if (!task) {
            throw new appError_1.AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
        }
        enforceTaskAccess(task, currentUser);
        if (terminalStatuses.includes(task.status)) {
            throw new appError_1.AppError("BAD_REQUEST", 400, "Terminal tasks are read-only in v1.");
        }
        if (payload.title !== undefined)
            task.title = payload.title;
        if (payload.description !== undefined)
            task.description = payload.description;
        if (payload.priority !== undefined)
            task.priority = payload.priority;
        if (payload.dueDate !== undefined)
            task.dueDate = payload.dueDate;
        task.updatedAt = new Date().toISOString();
        return task;
    },
    updateStatus: async (taskId, status, currentUser) => {
        const task = inMemoryDb_1.tasks.find((item) => item.taskId === taskId);
        if (!task) {
            throw new appError_1.AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
        }
        enforceTaskAccess(task, currentUser);
        assertValidTransition(task.status, status);
        task.status = status;
        task.updatedAt = new Date().toISOString();
        task.completedAt = status === "COMPLETED" ? task.updatedAt : null;
        return task;
    },
    updateAssignee: async (taskId, assignedTo, currentUser) => {
        const task = inMemoryDb_1.tasks.find((item) => item.taskId === taskId);
        if (!task) {
            throw new appError_1.AppError("NOT_FOUND", 404, `Task with id ${taskId} not found.`);
        }
        enforceTaskAccess(task, currentUser);
        const assignee = inMemoryDb_1.users.find((item) => item.userId === assignedTo && item.status === "ACTIVE");
        if (!assignee) {
            throw new appError_1.AppError("BAD_REQUEST", 400, "assignedTo must reference an ACTIVE user.");
        }
        task.assignedTo = assignedTo;
        task.updatedAt = new Date().toISOString();
        return task;
    }
};
