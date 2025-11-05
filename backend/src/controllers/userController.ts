import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Controlador para registrar um novo usuário
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📥 Recebendo requisição de registro');
    console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
    
    const { name, email, password, role } = req.body;

    console.log('📝 Tentando registrar usuário:', { name, email, role });

    // Validação básica
    if (!name || !email || !password) {
      console.log('❌ Campos obrigatórios faltando');
      res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
      return;
    }

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Usuário já existe:', email);
      res.status(400).json({ message: "Usuário já existe" });
      return;
    }

    // Hash da senha
    console.log('🔐 Fazendo hash da senha...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    console.log('💾 Criando usuário no banco...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    console.log('✅ Usuário criado com sucesso:', user._id);

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
    console.error('❌ Erro ao criar usuário:', error);
    res.status(500).json({ message: "Erro ao criar usuário", error: error instanceof Error ? error.message : String(error) });
  }
};

// Controlador para login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Tentando login:', email);

    // Busca o usuário
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    console.log('👤 Usuário encontrado, verificando senha...');

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Senha inválida para:', email);
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    console.log('✅ Senha válida, gerando token...');

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log('❌ JWT_SECRET não configurado');
      res.status(500).json({ message: "JWT_SECRET não configurado" });
      return;
    }

  const token = jwt.sign({ sub: (user._id as any).toString(), role: user.role }, secret, { expiresIn: '1h' });

    console.log('✅ Login bem-sucedido para:', email);

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
    console.error('❌ Erro no login:', error);
    res.status(500).json({ message: "Erro ao fazer login", error: error instanceof Error ? error.message : String(error) });
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

// Obter dados do usuário autenticado
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      position: user.position
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error });
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
