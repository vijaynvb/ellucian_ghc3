"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const appError_1 = require("../utils/appError");
const errorMiddleware = (error, _req, res, _next) => {
    if (error instanceof appError_1.AppError) {
        res.status(error.statusCode).json({
            code: error.code,
            message: error.message,
            timestamp: new Date().toISOString()
        });
        return;
    }
    res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
        timestamp: new Date().toISOString()
    });
};
exports.errorMiddleware = errorMiddleware;
