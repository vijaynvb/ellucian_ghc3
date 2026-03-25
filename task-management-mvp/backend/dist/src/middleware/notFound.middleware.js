"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const notFoundMiddleware = (_req, res) => {
    res.status(404).json({
        code: "NOT_FOUND",
        message: "Resource not found.",
        timestamp: new Date().toISOString()
    });
};
exports.notFoundMiddleware = notFoundMiddleware;
