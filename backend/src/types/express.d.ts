// Estendemos a interface Request usada pelo Express (via express-serve-static-core)
// para que `req.user` fique disponível em todo o código.
declare global {
  namespace Express {
    // Extendemos a interface Request para incluir `user` populado pelo middleware de auth
    interface Request {
      user?: {
        id: string; // id do usuário (string do Mongo ObjectId)
        role?: string; // papel do usuário (ex: 'tech' | 'user')
      };
    }
  }
}

export {};
