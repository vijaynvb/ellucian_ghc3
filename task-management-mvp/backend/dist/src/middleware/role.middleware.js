"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const appError_1 = require("../utils/appError");
const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new appError_1.AppError("UNAUTHORIZED", 401, "Unauthorized"));
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            next(new appError_1.AppError("FORBIDDEN", 403, "Insufficient permissions"));
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
