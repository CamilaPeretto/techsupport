import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
} from "../controllers/ticketController";

const router = Router();

// Criar novo ticket
router.post("/", createTicket);

// Listar todos os tickets (para técnicos)
router.get("/", getAllTickets);

// Obter ticket específico por ID
router.get("/:id", getTicketById);

// Atualizar status do ticket
router.put("/:id/status", updateTicketStatus);

// Atribuir ticket a um técnico
router.put("/:id/assign", assignTicket);

// Deletar ticket
router.delete("/:id", deleteTicket);

export default router;
