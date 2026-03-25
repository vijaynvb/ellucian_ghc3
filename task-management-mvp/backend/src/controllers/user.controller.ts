import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { userService } from "../services/user.service";

export const userController = {
  list: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.list(req.query as Record<string, unknown>);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  create: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.getById(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.update(req.params.userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
