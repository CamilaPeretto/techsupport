import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
} from "../controllers/ticketController";
import { requireTech } from "../middleware/requireTech";

const router = Router();

// Criar novo ticket (usuários e técnicos)
router.post("/", createTicket);

// Listar todos os tickets (para técnicos)
router.get("/", getAllTickets);

// Obter ticket específico por ID (usuários e técnicos)
router.get("/:id", getTicketById);

// Atualizar status do ticket (APENAS técnicos)
router.put("/:id/status", requireTech, updateTicketStatus);

// Atribuir ticket a um técnico (APENAS técnicos)
router.put("/:id/assign", requireTech, assignTicket);

// Deletar ticket (APENAS técnicos)
router.delete("/:id", requireTech, deleteTicket);

export default router;
