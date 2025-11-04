import mongoose, { Document, Schema } from "mongoose";

// Interface para o documento do usuário
export interface IUser extends Document {
  name: string;
  email?: string;
  password: string;
  role: "admin" | "Técnico" | "Funcionário";
  createdAt: Date;
  updatedAt: Date;
}

// Schema do usuário
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true, // Permite valores null/undefined únicos
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: 4,
    },
    role: {
      type: String,
      enum: ["admin", "Técnico", "Funcionário"],
      default: "Funcionário",
    },
  },
  {
    timestamps: true,
  }
);

// Exporta o modelo
export default mongoose.model<IUser>("User", UserSchema);
