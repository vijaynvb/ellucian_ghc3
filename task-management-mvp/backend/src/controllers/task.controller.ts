import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { taskService } from "../services/task.service";

export const taskController = {
  list: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await taskService.list(req.query as Record<string, unknown>, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  create: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await taskService.create(req.body, req.user!);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await taskService.getById(req.params.taskId, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await taskService.update(req.params.taskId, req.body, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  updateStatus: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await taskService.updateStatus(req.params.taskId, req.body.status, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  updateAssignee: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await taskService.updateAssignee(req.params.taskId, req.body.assignedTo, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
