import { Router } from "express";
import { registerUser, loginUser, getAllUsers, getUserById, updateUser, getCurrentUser } from "../controllers/userController";
import auth from "../middleware/auth";

const router = Router();

// POST /api/register
// Cria um novo usuário (registro). Validações aplicadas no controller.
router.post("/register", registerUser);

// POST /api/login
// Endpoint de login que retorna token JWT e dados do usuário
router.post("/login", loginUser);

// GET /api/me
// Retorna dados do usuário autenticado — exige middleware de auth
router.get("/me", auth, getCurrentUser);

// GET /api/users
// Lista usuários (requer autenticação) — proteger/filtrar conforme papéis conforme necessário
router.get("/users", auth, getAllUsers);

// GET /api/users/:id
// Recupera um usuário por id (requer autenticação)
router.get("/users/:id", auth, getUserById);

// PUT /api/users/:id
// Atualiza perfil de usuário (requer autenticação) — atualmente protegido por auth
router.put("/users/:id", auth, updateUser);

export default router;
