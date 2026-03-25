import { NextFunction, Response } from "express";
import { Role } from "../models/user.model";
import { AppError } from "../utils/appError";
import { AuthenticatedRequest } from "./auth.middleware";

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("UNAUTHORIZED", 401, "Unauthorized"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("FORBIDDEN", 403, "Insufficient permissions"));
      return;
    }

    next();
  };
};
