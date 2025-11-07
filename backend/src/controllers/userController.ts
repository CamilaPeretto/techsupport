// Imports: tipos do Express, modelo User, bcrypt para hash e jsonwebtoken para emitir tokens
import { Request, Response } from "express";
type AuthRequest = Request & { user?: { id: string; role?: string } };
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Controller: cria um novo usuário
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrai campos do corpo da requisição
    const { name, email, password, role } = req.body;

    // Valida presença dos campos obrigatórios
    if (!name || !email || !password) {
      // Se algum campo obrigatório falta, retorna 400 Bad Request
      res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
      return;
    }

    // Verifica existência prévia do usuário para evitar duplicidade
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Se já existe usuário com o mesmo email, retorna 400
      res.status(400).json({ message: "Usuário já existe" });
      return;
    }

    // Gera hash da senha antes de persistir (bcrypt com salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário no banco com campos obrigatórios
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Retorna resposta sem expor o hash da senha
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
    // Em caso de erro, retornamos 500 com mensagem (evitar expor stacks em produção)
    res.status(500).json({ message: "Erro ao criar usuário", error: error instanceof Error ? error.message : String(error) });
  }
};

// Controlador para login
// Controller: autenticação de usuário (login)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrai credenciais do corpo
    const { email, password } = req.body;

    // Busca usuário por email
    const user = await User.findOne({ email });
    if (!user) {
      // Se não encontrou o usuário, credenciais inválidas
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    // Verifica senha comparando com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Senha incorreta
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    // Gera JWT com sub = user._id e role no payload
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Se o segredo JWT não está configurado, retorna 500
      res.status(500).json({ message: "JWT_SECRET não configurado" });
      return;
    }

    // Cria token com expiração de 1 hora
    const token = jwt.sign({ sub: (user._id as any).toString(), role: user.role }, secret, { expiresIn: '1h' });

    // Retorna token e dados do usuário (sem senha)
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
    // Em caso de erro inesperado
    res.status(500).json({ message: "Erro ao fazer login", error: error instanceof Error ? error.message : String(error) });
  }
};

// Retorna todos os usuários sem o campo de senha
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Busca todos os usuários e omite o campo password
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    // Erro ao buscar usuários
    res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

// Retorna o usuário atual obtido via middleware de auth
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verifica se middleware de auth populou req.user
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }
    // Busca usuário no banco sem o campo password
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      // Se não encontrado, retorna 404
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    // Retorna informações públicas do usuário
    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      position: user.position
    });
  } catch (error) {
    // Erro ao recuperar o usuário
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};

// Busca usuário por ID (sem senha)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrai id dos parâmetros da rota
    const { id } = req.params;
    // Busca usuário e omite senha
    const user = await User.findById(id).select("-password");
    if (!user) {
      // Retorna 404 se não encontrado
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    // Retorna o usuário encontrado
    res.status(200).json(user);
  } catch (error) {
    // Erro genérico
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};

// Atualiza campos do usuário (name, email, password). Retorna o usuário atualizado sem senha
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrai id e campos opcionais do corpo
    const { id } = req.params;
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

    // Prepara objeto de update dinamicamente
    const update: Record<string, unknown> = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 10);

    // Executa atualização e retorna o documento novo
    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select("-password");
    if (!updated) {
      // Se não encontrou o usuário para atualizar
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    // Retorna usuário atualizado sem senha
    res.status(200).json({ message: "Perfil atualizado com sucesso", user: updated });
  } catch (error) {
    // Erro ao atualizar perfil
    res.status(500).json({ message: "Erro ao atualizar perfil", error });
  }
};
