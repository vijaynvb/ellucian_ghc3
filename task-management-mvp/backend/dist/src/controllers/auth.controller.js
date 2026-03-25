"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
exports.authController = {
    login: async (req, res, next) => {
        try {
            const result = await auth_service_1.authService.login(req.body.email, req.body.password);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    logout: async (_req, res, next) => {
        try {
            const result = await auth_service_1.authService.logout();
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
};
