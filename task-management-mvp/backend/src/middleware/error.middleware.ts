import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString()
    });
    return;
  }

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
    timestamp: new Date().toISOString()
  });
};
