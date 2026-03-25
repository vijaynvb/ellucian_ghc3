import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  logout: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.logout();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
