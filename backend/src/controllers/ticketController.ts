import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import mongoose from "mongoose";

// Controlador para criar um novo ticket
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, userId, priority } = req.body;

    // Validação
    if (!title || !userId) {
      res.status(400).json({ message: "Título e userId são obrigatórios" });
      return;
    }

    const newTicket = await Ticket.create({
      title,
      description,
      userId,
      priority: priority || "média",
    });

    res.status(201).json({
      message: "Ticket criado com sucesso",
      ticket: newTicket,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar ticket", error });
  }
};

// Controlador para listar todos os tickets
export const getAllTickets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.find()
      .populate("userId", "name email role")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
      
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tickets", error });
  }
};

// Controlador para obter um ticket específico
export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    const ticket = await Ticket.findById(id)
      .populate("userId", "name email role")
      .populate("assignedTo", "name email");

    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar ticket", error });
  }
};

// Controlador para atualizar o status de um ticket
export const updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    if (!["aberto", "em andamento", "concluído"].includes(status)) {
      res.status(400).json({ message: "Status inválido" });
      return;
    }

    const ticketAtualizado = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId", "name email role");

    if (!ticketAtualizado) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    res.json({
      message: "Status atualizado com sucesso",
      ticket: ticketAtualizado,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar status", error });
  }
};

// Controlador para atribuir ticket a um técnico
export const assignTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { assignedTo, status: "em andamento" },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    res.json({
      message: "Ticket atribuído com sucesso",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atribuir ticket", error });
  }
};

// Controlador para deletar um ticket
export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    res.json({ message: "Ticket deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar ticket", error });
  }
};
