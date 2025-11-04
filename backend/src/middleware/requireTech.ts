/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar se o usuário é um técnico
 * Deve ser usado APÓS o middleware auth
 */
export const requireTech = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // req.user é populado pelo middleware auth
  if (!req.user) {
    res.status(401).json({ message: "Autenticação necessária" });
    return;
  }

  if (req.user.role !== "tech") {
    res.status(403).json({ 
      message: "Acesso negado. Apenas técnicos podem realizar esta operação." 
    });
    return;
  }

  next();
};
