"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const inMemoryDb_1 = require("../data/inMemoryDb");
const appError_1 = require("../utils/appError");
const jwt_1 = require("../utils/jwt");
const sanitizeUser = (userId) => {
    const user = inMemoryDb_1.users.find((item) => item.userId === userId);
    if (!user) {
        throw new appError_1.AppError("NOT_FOUND", 404, "User not found");
    }
    return {
        userId: user.userId,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};
exports.authService = {
    login: async (email, password) => {
        const user = inMemoryDb_1.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
        if (!user || user.status !== "ACTIVE") {
            throw new appError_1.AppError("BAD_REQUEST", 400, "Invalid credentials");
        }
        const matches = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!matches) {
            throw new appError_1.AppError("BAD_REQUEST", 400, "Invalid credentials");
        }
        return {
            accessToken: (0, jwt_1.signAccessToken)({ userId: user.userId, email: user.email, role: user.role }),
            tokenType: "Bearer",
            expiresInSeconds: 28800,
            user: sanitizeUser(user.userId)
        };
    },
    logout: async () => ({
        message: "Logged out successfully"
    })
};
