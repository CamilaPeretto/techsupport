import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
} from "../controllers/ticketController";
import { requireTech } from "../middleware/auth";

const router = Router();

// POST /api/tickets/
// Rota para criação de um novo ticket. Pode ser usada por usuários e técnicos.
router.post("/", createTicket);

// GET /api/tickets/
// Lista tickets — a lógica de filtragem/visibilidade está no controller
router.get("/", getAllTickets);

// GET /api/tickets/:id
// Recupera um ticket por ID (usuários podem ver seus próprios tickets)
router.get("/:id", getTicketById);

// PUT /api/tickets/:id/status
// Atualiza o status do ticket — protegido para técnicos apenas
router.put("/:id/status", requireTech, updateTicketStatus);

// PUT /api/tickets/:id/assign
// Atribui um ticket a um técnico — protegido para técnicos apenas
router.put("/:id/assign", requireTech, assignTicket);

// DELETE /api/tickets/:id
// Deleta um ticket — protegido para técnicos apenas
router.delete("/:id", requireTech, deleteTicket);

export default router;
