"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../services/user.service");
exports.userController = {
    list: async (req, res, next) => {
        try {
            const result = await user_service_1.userService.list(req.query);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await user_service_1.userService.create(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await user_service_1.userService.getById(req.params.userId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await user_service_1.userService.update(req.params.userId, req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
};
