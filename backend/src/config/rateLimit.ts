import rateLimit from "express-rate-limit";

// Configuração de rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por IP
  message: "Muitas requisições deste IP, tente novamente mais tarde.",
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo de 5 tentativas de login
  message: "Muitas tentativas de login, tente novamente mais tarde.",
});
