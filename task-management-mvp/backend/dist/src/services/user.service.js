"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const inMemoryDb_1 = require("../data/inMemoryDb");
const appError_1 = require("../utils/appError");
const pagination_1 = require("../utils/pagination");
const sanitizeUser = (user) => ({
    userId: user.userId,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});
exports.userService = {
    list: async (query) => {
        const page = Number(query.page ?? 1);
        const pageSize = Number(query.pageSize ?? 20);
        const role = query.role;
        const status = query.status;
        let filtered = [...inMemoryDb_1.users];
        if (role) {
            filtered = filtered.filter((item) => item.role === role);
        }
        if (status) {
            filtered = filtered.filter((item) => item.status === status);
        }
        const start = (page - 1) * pageSize;
        const data = filtered.slice(start, start + pageSize).map(sanitizeUser);
        return {
            data,
            pagination: (0, pagination_1.buildPagination)(page, pageSize, filtered.length)
        };
    },
    create: async (payload) => {
        const alreadyExists = inMemoryDb_1.users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase());
        if (alreadyExists) {
            throw new appError_1.AppError("BAD_REQUEST", 400, "Email already exists");
        }
        const timestamp = new Date().toISOString();
        const passwordHash = await bcryptjs_1.default.hash(payload.password, 10);
        const newUser = {
            userId: `usr_${String(inMemoryDb_1.users.length + 1).padStart(3, "0")}`,
            email: payload.email,
            passwordHash,
            role: payload.role,
            status: payload.status ?? "ACTIVE",
            createdAt: timestamp,
            updatedAt: timestamp
        };
        inMemoryDb_1.users.push(newUser);
        return sanitizeUser(newUser);
    },
    getById: async (userId) => {
        const user = inMemoryDb_1.users.find((item) => item.userId === userId);
        if (!user) {
            throw new appError_1.AppError("NOT_FOUND", 404, `User with id ${userId} not found.`);
        }
        return sanitizeUser(user);
    },
    update: async (userId, payload) => {
        const user = inMemoryDb_1.users.find((item) => item.userId === userId);
        if (!user) {
            throw new appError_1.AppError("NOT_FOUND", 404, `User with id ${userId} not found.`);
        }
        if (payload.role) {
            user.role = payload.role;
        }
        if (payload.status) {
            user.status = payload.status;
        }
        user.updatedAt = new Date().toISOString();
        return sanitizeUser(user);
    }
};
