import mongoose, { Document, Schema } from "mongoose";

// Interface para o documento do ticket (tipagem TypeScript)
export interface ITicket extends Document {
  ticketNumber?: number; // número sequencial do ticket (gerado via Counter)
  title: string;
  description?: string;
  status: "aberto" | "em andamento" | "concluído";
  type?: "hardware" | "software" | "rede" | "outros";
  createdAt: Date;
  userId: mongoose.Types.ObjectId; // referência ao usuário que abriu o ticket
  assignedTo?: mongoose.Types.ObjectId; // técnico responsável (ref User)
  priority?: "baixa" | "média" | "alta";
  resolution?: string; // texto de resolução
  resolvedAt?: Date | null; // data de resolução
  resolutionNotes?: { text: string; at: Date; by?: mongoose.Types.ObjectId }[];
  statusHistory?: {
    status: string;
    changedAt: Date;
    changedBy?: mongoose.Types.ObjectId;
    assignedTechnicianName?: string;
  }[];
  assignedAt?: Date | null; // quando foi atribuído
  inProgressAt?: Date | null; // quando entrou em andamento
  updatedAt: Date;
}

// Schema do ticket com campos essenciais e arrays de histórico
const TicketSchema: Schema = new Schema(
  {
    ticketNumber: {
      type: Number,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["aberto", "em andamento", "concluído"],
      default: "aberto",
    },
    type: {
      type: String,
      enum: ["hardware", "software", "rede", "outros"],
      default: "outros",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID do usuário é obrigatório"],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["baixa", "média", "alta"],
      default: "média",
    },
    resolution: {
      type: String,
      default: "",
      trim: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionNotes: [
      {
        text: { type: String, required: true, trim: true },
        at: { type: Date, default: Date.now },
        by: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        assignedTechnicianName: { type: String },
      },
    ],
    assignedAt: {
      type: Date,
      default: null,
    },
    inProgressAt: {
      type: Date,
      default: null,
    },
  },
  {
    // timestamps adiciona createdAt e updatedAt automaticamente
    timestamps: true,
  }
);

// Exporta o modelo Mongoose para uso na aplicação
export default mongoose.model<ITicket>("Ticket", TicketSchema);
