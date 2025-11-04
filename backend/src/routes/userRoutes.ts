import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById 
} from "../controllers/userController";

const router = Router();

// Rota para login
router.post("/login", loginUser);

// Rota para registrar usuário
router.post("/register", registerUser);

// Rota para criar usuário (alias para register)
router.post("/", registerUser);

// Rota para listar usuários
router.get("/", getAllUsers);

// Rota para obter usuário por ID
router.get("/:id", getUserById);

export default router;
