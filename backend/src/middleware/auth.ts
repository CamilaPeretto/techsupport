import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tipagem do payload esperado dentro do JWT
export interface AuthPayload {
  sub: string; // sujeito do token (usamos o id do usuário como sub)
  role?: string; // papel do usuário (ex: 'tech' | 'user')
  iat?: number; // issued at (timestamp)
  exp?: number; // expiration (timestamp)
}

/**
 * Middleware de autenticação (verifica Authorization: Bearer <token>)
 * - Valida que o header Authorization existe e está no formato Bearer
 * - Recupera o segredo do env e verifica o token
 * - Preenche req.user com { id, role } (tipado em src/types/express.d.ts)
 */
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization; // string ou undefined
    // Se não houver header ou não começar por Bearer, não autenticado
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Extrai o token removendo o prefixo "Bearer "
    const token = header.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'JWT_SECRET não configurado' });

    // Valida o token e recupera o payload tipado
    const payload = jwt.verify(token, secret) as AuthPayload;
    // popula req.user usando a tipagem global definida em src/types/express.d.ts
    // cast to any to avoid runtime/compile-time mismatch when ts-node doesn't pick up the ambient types
    (req as any).user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    // Em caso de token inválido/expirado retornamos 401
    return res.status(401).json({ message: 'Token inválido' });
  }
};

/**
 * Factory para criar middlewares de autorização por papel.
 * Ex: requireRole('tech') retorna um middleware que só permite usuários com role 'tech'.
 */
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      // Se não autenticado, 401
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }
    const user = (req as any).user;
    if (user.role !== role) {
      // Se o papel do usuário não bate com o esperado, 403
      res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
      return;
    }

    next();
  };
};

// Conveniência para checar se é técnico
export const requireTech = requireRole('tech');

export default auth;
