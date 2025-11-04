import mongoose, { Document, Schema } from "mongoose";

// Interface para o documento do ticket
export interface ITicket extends Document {
  title: string;
  description?: string;
  status: "aberto" | "em andamento" | "concluído";
  type?: "hardware" | "software" | "rede" | "outros";
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId; // Técnico responsável
  priority?: "baixa" | "média" | "alta";
  resolution?: string;
  resolvedAt?: Date | null;
  resolutionNotes?: { text: string; at: Date; by?: mongoose.Types.ObjectId }[];
  updatedAt: Date;
}

// Schema do ticket
const TicketSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Exporta o modelo
export default mongoose.model<ITicket>("Ticket", TicketSchema);
