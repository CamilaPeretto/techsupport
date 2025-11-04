import jwt from "jsonwebtoken";

// Função para gerar token JWT
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "default_secret";
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};
