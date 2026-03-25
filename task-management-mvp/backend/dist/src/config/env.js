"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: Number(process.env.PORT ?? 3000),
    JWT_SECRET: process.env.JWT_SECRET ?? "dev_secret_change_me",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "8h"
};
