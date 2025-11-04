import { Request, Response, NextFunction } from "express";

// Middleware para logar requisições
export const logger = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};
