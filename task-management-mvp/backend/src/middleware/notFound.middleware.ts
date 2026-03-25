import { Request, Response } from "express";

export const notFoundMiddleware = (_req: Request, res: Response): void => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: "Resource not found.",
    timestamp: new Date().toISOString()
  });
};
