import { Router } from "express";
import { registerUser, loginUser, getAllUsers, getUserById, updateUser, getCurrentUser } from "../controllers/userController";
import auth from "../middleware/auth";

const router = Router();

// Rota para registrar usuário
router.post("/register", registerUser);

// Rota para login
router.post("/login", loginUser);

// Rota para obter dados do usuário autenticado
router.get("/me", auth, getCurrentUser);

// Rota para listar usuários
router.get("/users", auth, getAllUsers);

// Obter usuário por id
router.get("/users/:id", auth, getUserById);

// Atualizar perfil (simples, sem auth neste MVP)
router.put("/users/:id", auth, updateUser);

export default router;
