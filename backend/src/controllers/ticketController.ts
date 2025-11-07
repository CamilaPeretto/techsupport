import { Request, Response } from "express";
type AuthRequest = Request & { user?: { id: string; role?: string } };
import Ticket from "../models/Ticket";
import Counter from "../models/Counter";
import mongoose from "mongoose";

// Cria um novo ticket
export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extrai campos do corpo
    const { title, description, priority, type } = req.body;

    // Validação: título é obrigatório
    if (!title) {
      res.status(400).json({ message: "Título é obrigatório" });
      return;
    }

    // Validação: usuário autenticado (preenchido pelo middleware auth)
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    // Incrementa contador atômico para ticketNumber
    const next = await Counter.findOneAndUpdate(
      { _id: 'ticketNumber' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    // Cria o documento do ticket com status inicial
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

    // Retorna 201 com o ticket criado
    res.status(201).json({
      message: "Ticket criado com sucesso",
      ticket: newTicket,
    });
  } catch (error) {
    // Erro genérico ao criar ticket
    res.status(500).json({ message: "Erro ao criar ticket", error });
  }
};

// Lista tickets com filtros opcionais
export const getAllTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extrai parâmetros de query para filtragem
    const { assignedTo, userId, status, priority, type, fromDate, toDate } = req.query as {
      assignedTo?: string;
      userId?: string;
      status?: string;
      priority?: string;
      type?: string;
      fromDate?: string;
      toDate?: string;
    };

    // Inicializa filtro vazio
    const filter: Record<string, unknown> = {};
    
    // Se o usuário não for técnico, limita aos próprios tickets
    if (req.user && req.user.role !== "tech") {
      filter.userId = req.user.id;
    } else {
      // Técnicos podem filtrar por assignedTo ou userId quando fornecidos
      if (assignedTo) filter.assignedTo = assignedTo;
      if (userId) filter.userId = userId;
    }
    
    // Aplica filtros adicionais se presentes
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (fromDate || toDate) {
      filter.createdAt = {} as any;
      if (fromDate) (filter.createdAt as any).$gte = new Date(fromDate);
      if (toDate) (filter.createdAt as any).$lte = new Date(toDate);
    }

    // Busca tickets aplicando populate para dados relacionados e ordena por criação desc
    const tickets = await Ticket.find(filter)
      .populate("userId", "name email role")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
      
    // Retorna lista de tickets
    res.status(200).json(tickets);
  } catch (error) {
    // Erro ao buscar tickets
    res.status(500).json({ message: "Erro ao buscar tickets", error });
  }
};

// Recupera ticket por ID
export const getTicketById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extrai id dos parâmetros
    const { id } = req.params;

    // Valida formato do ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    // Busca o ticket e popula referências úteis
    const ticket = await Ticket.findById(id)
      .populate("userId", "name email role")
        .populate("assignedTo", "name email")
        .populate("statusHistory.changedBy", "name");

    // Se não encontrado, retorna 404
    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    // Se o usuário não for técnico, assegurar que ele seja o dono do ticket
    if (req.user && req.user.role !== "tech") {
      if (ticket.userId._id.toString() !== req.user.id) {
        res.status(403).json({ message: "Você não tem permissão para ver este ticket" });
        return;
      }
    }

    // Retorna o ticket encontrado
    res.status(200).json(ticket);
  } catch (error) {
    // Erro ao recuperar ticket
    res.status(500).json({ message: "Erro ao buscar ticket", error });
  }
};

// Atualiza status do ticket (apenas valores permitidos)
export const updateTicketStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extrai id e payload do corpo
    const { id } = req.params;
    const { status, resolution } = req.body as { status: string; resolution?: string };

    // Valida ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    // Valida status permitido
    if (!["aberto", "em andamento", "concluído"].includes(status)) {
      res.status(400).json({ message: "Status inválido" });
      return;
    }

    // Busca ticket atual
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    // Monta objeto de update
    const update: any = { status };
    if (resolution !== undefined) update.resolution = resolution;
    if (status === "concluído") update.resolvedAt = new Date();
    if (status === "em andamento" && !ticket.inProgressAt) {
      update.inProgressAt = new Date();
    }
    
    // Adiciona entrada ao statusHistory
    update.$push = {
      statusHistory: {
        status,
        changedAt: new Date(),
        changedBy: req.user?.id,
      }
    };

    // Executa atualização e retorna o novo documento populado
    const ticketAtualizado = await Ticket.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).populate("userId", "name email role").populate("assignedTo", "name email");

    // Se por algum motivo não existe após update
    if (!ticketAtualizado) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    // Retorna ticket atualizado
    res.json({
      message: "Status atualizado com sucesso",
      ticket: ticketAtualizado,
    });
  } catch (error) {
    // Erro genérico ao atualizar
    res.status(500).json({ message: "Erro ao atualizar status", error });
  }
};

// Atribui ticket a um técnico (apenas técnicos podem executar)
export const assignTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extrai id do ticket e id do técnico a ser atribuído
    const { id } = req.params;
    const { assignedTo } = req.body;

    // Valida formato do id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    // Verifica permissão: somente técnicos
    if (!req.user || req.user.role !== 'tech') {
      res.status(403).json({ message: "Apenas técnicos podem atribuir tickets" });
      return;
    }

    // Pega nome do técnico para armazenar no histórico (se existir)
    const User = mongoose.model('User');
    const technician = await User.findById(assignedTo).select('name');
    
    // Atualiza o ticket com assignedTo, timestamps e histórico
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

    // Se não encontrou o ticket
    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    // Retorna ticket atualizado
    res.json({
      message: "Ticket atribuído com sucesso",
      ticket,
    });
  } catch (error) {
    // Erro ao atribuir ticket
    res.status(500).json({ message: "Erro ao atribuir ticket", error });
  }
};

// Deleta um ticket por ID (apenas técnicos na rota)
export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrai id
    const { id } = req.params;

    // Valida formato do id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID do ticket inválido" });
      return;
    }

    // Remove o ticket
    const ticket = await Ticket.findByIdAndDelete(id);

    // Se não existia, 404
    if (!ticket) {
      res.status(404).json({ message: "Ticket não encontrado" });
      return;
    }

    // Sucesso
    res.json({ message: "Ticket deletado com sucesso" });
  } catch (error) {
    // Erro ao deletar
    res.status(500).json({ message: "Erro ao deletar ticket", error });
  }
};
