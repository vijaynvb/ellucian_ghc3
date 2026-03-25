"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = exports.users = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const now = new Date().toISOString();
const defaultPasswordHash = bcryptjs_1.default.hashSync("password", 10);
exports.users = [
    {
        userId: "usr_001",
        email: "admin@example.com",
        passwordHash: defaultPasswordHash,
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now
    },
    {
        userId: "usr_002",
        email: "user@example.com",
        passwordHash: defaultPasswordHash,
        role: "END_USER",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now
    }
];
exports.tasks = [];
