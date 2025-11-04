import { Request, Response, NextFunction } from "express";

// Middleware de autenticação (exemplo básico)
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Aqui você implementaria a lógica de verificação de token JWT
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  // Verificação do token (implementar com jsonwebtoken)
  next();
};
