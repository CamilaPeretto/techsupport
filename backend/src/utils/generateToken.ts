import jwt from "jsonwebtoken";

// Função para gerar token JWT
export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || "default_secret";
  return jwt.sign({ id: userId, role }, secret, { expiresIn: "7d" });
};

// Função para verificar token JWT
export const verifyToken = (token: string): { id: string; role: string } | null => {
  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    return jwt.verify(token, secret) as { id: string; role: string };
  } catch (error) {
    return null;
  }
};
