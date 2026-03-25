import { NextFunction, Request, Response } from "express";
import { Role } from "../models/user.model";
import { AppError } from "../utils/appError";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("UNAUTHORIZED", 401, "Missing or invalid token"));
    return;
  }

  try {
    const token = authHeader.slice(7);
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError("UNAUTHORIZED", 401, "Invalid or expired token"));
  }
};
