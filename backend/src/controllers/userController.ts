import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Controlador para registrar um novo usuário
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Usuário já existe" });
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
};

// Controlador para login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Busca o usuário
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "JWT_SECRET não configurado" });
      return;
    }

  const token = jwt.sign({ sub: (user._id as any).toString(), role: user.role }, secret, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};

// Controlador para obter todos os usuários
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

// Obter um usuário por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};

// Atualizar perfil do usuário
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

    const update: Record<string, unknown> = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 10);

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select("-password");
    if (!updated) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json({ message: "Perfil atualizado com sucesso", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil", error });
  }
};
