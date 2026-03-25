"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const task_service_1 = require("../services/task.service");
exports.taskController = {
    list: async (req, res, next) => {
        try {
            const result = await task_service_1.taskService.list(req.query, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await task_service_1.taskService.create(req.body, req.user);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await task_service_1.taskService.getById(req.params.taskId, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await task_service_1.taskService.update(req.params.taskId, req.body, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const result = await task_service_1.taskService.updateStatus(req.params.taskId, req.body.status, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    updateAssignee: async (req, res, next) => {
        try {
            const result = await task_service_1.taskService.updateAssignee(req.params.taskId, req.body.assignedTo, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
};
