import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/userController";

const router = Router();

// Rota para registrar usuário
router.post("/register", registerUser);

// Rota para login
router.post("/login", loginUser);

// Rota para listar usuários
router.get("/users", getAllUsers);

export default router;
