import mongoose, { Document, Schema } from "mongoose";

// Interface para o documento do usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "tech";
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
      enum: ["admin", "user", "tech"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Exporta o modelo
export default mongoose.model<IUser>("User", UserSchema);
