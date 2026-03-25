"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportValidation = void 0;
const zod_1 = require("zod");
exports.reportValidation = {
    overdue: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().int().min(1).optional(),
            pageSize: zod_1.z.coerce.number().int().min(1).max(100).optional()
        }),
        params: zod_1.z.object({}).optional(),
        body: zod_1.z.object({}).optional()
    }),
    productivity: zod_1.z.object({
        query: zod_1.z.object({
            period: zod_1.z.enum(["daily", "weekly", "monthly"]),
            fromDate: zod_1.z.string().date().optional(),
            toDate: zod_1.z.string().date().optional()
        }),
        params: zod_1.z.object({}).optional(),
        body: zod_1.z.object({}).optional()
    }),
    trend: zod_1.z.object({
        query: zod_1.z.object({
            granularity: zod_1.z.enum(["day", "week"]),
            fromDate: zod_1.z.string().date(),
            toDate: zod_1.z.string().date()
        }),
        params: zod_1.z.object({}).optional(),
        body: zod_1.z.object({}).optional()
    })
};
