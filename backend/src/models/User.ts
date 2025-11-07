import mongoose, { Document, Schema } from "mongoose";

// Interface TypeScript para o documento de usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // hash da senha
  role: "tech" | "user"; // combinador para papéis
  department?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do usuário.
// Observações de segurança: não exponha o campo `password` via select em endpoints públicos.
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["tech", "user"],
      default: "user",
    },
    department: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
  },
  {
    // timestamps cria createdAt e updatedAt automaticamente
    timestamps: true,
  }
);

// Exporta o modelo Mongoose criado a partir do schema e interface
export default mongoose.model<IUser>("User", UserSchema);
