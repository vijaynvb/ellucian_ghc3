import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { reportService } from "../services/report.service";

export const reportController = {
  statusSummary: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await reportService.statusSummary(req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  overdue: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await reportService.overdue(req.query as Record<string, unknown>, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  productivity: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await reportService.productivity(req.query as any, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  trend: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await reportService.trend(req.query as any, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
