import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { categoryService } from "../services/category.service";

export const categoryController = {
  list: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await categoryService.list(req.query as Record<string, unknown>);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  create: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await categoryService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await categoryService.getById(req.params.categoryId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await categoryService.update(req.params.categoryId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await categoryService.remove(req.params.categoryId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};