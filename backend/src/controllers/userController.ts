import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

// Controlador para login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, email } = req.body;

    // Busca por name ou email
    const user = await User.findOne({
      $or: [{ name }, { email }]
    });

    if (!user) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    // Verifica a senha (sem hash para compatibilidade com dados existentes)
    // TODO: Implementar hash de senha em produção
    const isPasswordValid = password === user.password || 
      await bcrypt.compare(password, user.password).catch(() => false);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    res.status(200).json({
      message: "Login realizado com sucesso",
      role: user.role,
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

// Controlador para registrar um novo usuário
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({
      $or: [{ name }, ...(email ? [{ email }] : [])]
    });
    
    if (existingUser) {
      res.status(400).json({ message: "Usuário já existe" });
      return;
    }

    // Hash da senha (opcional - manter compatibilidade)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const user = await User.create({
      name,
      email,
      password, // ou hashedPassword
      role: role || "Funcionário",
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

// Controlador para obter todos os usuários
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

// Controlador para obter usuário por ID
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
