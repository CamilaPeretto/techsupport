import { Router } from "express";
import { registerUser, loginUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";

const router = Router();

// Rota para registrar usuário
router.post("/register", registerUser);

// Rota para login
router.post("/login", loginUser);

// Rota para listar usuários
router.get("/users", getAllUsers);

// Obter usuário por id
router.get("/users/:id", getUserById);

// Atualizar perfil (simples, sem auth neste MVP)
router.put("/users/:id", updateUser);

export default router;
