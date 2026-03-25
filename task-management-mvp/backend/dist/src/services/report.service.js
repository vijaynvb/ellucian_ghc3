"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const inMemoryDb_1 = require("../data/inMemoryDb");
const pagination_1 = require("../utils/pagination");
const statuses = ["NEW", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"];
const scopedTasks = (currentUser) => {
    if (currentUser.role === "ADMIN") {
        return [...inMemoryDb_1.tasks];
    }
    return inMemoryDb_1.tasks.filter((item) => item.createdBy === currentUser.userId || item.assignedTo === currentUser.userId);
};
exports.reportService = {
    statusSummary: async (currentUser) => {
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
    overdue: async (query, currentUser) => {
        const page = Number(query.page ?? 1);
        const pageSize = Number(query.pageSize ?? 20);
        const today = new Date().toISOString().slice(0, 10);
        const overdueItems = scopedTasks(currentUser).filter((item) => item.dueDate && item.dueDate < today && item.status !== "COMPLETED");
        const start = (page - 1) * pageSize;
        const data = overdueItems.slice(start, start + pageSize);
        return {
            generatedAt: new Date().toISOString(),
            data,
            pagination: (0, pagination_1.buildPagination)(page, pageSize, overdueItems.length)
        };
    },
    productivity: async (query, currentUser) => {
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
    trend: async (query, currentUser) => {
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
