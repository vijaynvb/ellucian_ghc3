"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const roleSchema = zod_1.z.enum(["END_USER", "ADMIN"]);
const statusSchema = zod_1.z.enum(["ACTIVE", "INACTIVE"]);
exports.userValidation = {
    listUsers: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().int().min(1).optional(),
            pageSize: zod_1.z.coerce.number().int().min(1).max(100).optional(),
            role: roleSchema.optional(),
            status: statusSchema.optional()
        }),
        body: zod_1.z.object({}).optional(),
        params: zod_1.z.object({}).optional()
    }),
    createUser: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(8),
            role: roleSchema,
            status: statusSchema.optional()
        }),
        query: zod_1.z.object({}).optional(),
        params: zod_1.z.object({}).optional()
    }),
    updateUser: zod_1.z.object({
        params: zod_1.z.object({ userId: zod_1.z.string().min(1) }),
        body: zod_1.z
            .object({
            role: roleSchema.optional(),
            status: statusSchema.optional()
        })
            .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
        query: zod_1.z.object({}).optional()
    }),
    userById: zod_1.z.object({
        params: zod_1.z.object({ userId: zod_1.z.string().min(1) }),
        query: zod_1.z.object({}).optional(),
        body: zod_1.z.object({}).optional()
    })
};
