"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const appError_1 = require("../utils/appError");
const jwt_1 = require("../utils/jwt");
const requireAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next(new appError_1.AppError("UNAUTHORIZED", 401, "Missing or invalid token"));
        return;
    }
    try {
        const token = authHeader.slice(7);
        req.user = (0, jwt_1.verifyAccessToken)(token);
        next();
    }
    catch {
        next(new appError_1.AppError("UNAUTHORIZED", 401, "Invalid or expired token"));
    }
};
exports.requireAuth = requireAuth;
