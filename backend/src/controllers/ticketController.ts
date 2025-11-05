/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import Counter from "../models/Counter";
import mongoose from "mongoose";

// Controlador para criar um novo ticket
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, type } = req.body;

    // Validação
    if (!title) {
      res.status(400).json({ message: "Título é obrigatório" });
      return;
    }

    // Usa o ID do usuário autenticado
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    // Gera um número sequencial para o ticket
    const next = await Counter.findOneAndUpdate(
      { _id: 'ticketNumber' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const newTicket = await Ticket.create({
      ticketNumber: next?.seq,
      title,
      description,
      userId: req.user.id,
      priority: priority || "média",
      type: type || "outros",
      statusHistory: [
        {
          status: "aberto",
          changedAt: new Date(),
          changedBy: req.user.id,
        }
      ]
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
export const getAllTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assignedTo, userId, status, priority, type, fromDate, toDate } = req.query as {
      assignedTo?: string;
      userId?: string;
      status?: string;
      priority?: string;
      type?: string;
      fromDate?: string;
      toDate?: string;
    };

    const filter: Record<string, unknown> = {};
    
    // Se o usuário não é técnico, só pode ver seus próprios tickets
    if (req.user && req.user.role !== "tech") {
      filter.userId = req.user.id;
    } else {
      // Técnicos podem filtrar por qualquer userId ou assignedTo
      if (assignedTo) filter.assignedTo = assignedTo;
      if (userId) filter.userId = userId;
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (fromDate || toDate) {
      filter.createdAt = {} as any;
      if (fromDate) (filter.createdAt as any).$gte = new Date(fromDate);
      if (toDate) (filter.createdAt as any).$lte = new Date(toDate);
    }

    const tickets = await Ticket.find(filter)
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
        .populate("assignedTo", "name email")
        .populate("statusHistory.changedBy", "name");

    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    // Verifica se o usuário tem permissão para ver este ticket
    // Técnicos podem ver todos, usuários só podem ver seus próprios
    if (req.user && req.user.role !== "tech") {
      if (ticket.userId._id.toString() !== req.user.id) {
        res.status(403).json({ message: "Você não tem permissão para ver este ticket" });
        return;
      }
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
    const { status, resolution } = req.body as { status: string; resolution?: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    if (!["aberto", "em andamento", "concluído"].includes(status)) {
      res.status(400).json({ message: "Status inválido" });
      return;
    }

    // Buscar o ticket primeiro para verificar o estado atual
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    const update: any = { status };
    if (resolution !== undefined) update.resolution = resolution;
    if (status === "concluído") update.resolvedAt = new Date();
    if (status === "em andamento" && !ticket.inProgressAt) {
      update.inProgressAt = new Date();
    }
    
    // Adiciona o evento ao histórico
    update.$push = {
      statusHistory: {
        status,
        changedAt: new Date(),
        changedBy: req.user?.id,
      }
    };

    const ticketAtualizado = await Ticket.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).populate("userId", "name email role").populate("assignedTo", "name email");

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

    // Já verificado pelo middleware requireTech, mas mantém verificação defensiva
    if (!req.user || req.user.role !== 'tech') {
      res.status(403).json({ message: "Apenas técnicos podem atribuir tickets" });
      return;
    }

    // Busca o técnico para obter o nome
    const User = mongoose.model('User');
    const technician = await User.findById(assignedTo).select('name');
    
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { 
        assignedTo, 
        status: "em andamento",
        assignedAt: new Date(),
        inProgressAt: new Date(),
        $push: {
          statusHistory: {
            status: "atribuído",
            changedAt: new Date(),
            changedBy: req.user.id,
            assignedTechnicianName: technician?.name || 'Técnico',
          }
        }
      },
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
