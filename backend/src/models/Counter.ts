import mongoose, { Schema, Document } from 'mongoose';

// Interface para o documento do contador (usado para sequências como ticketNumber)
interface ICounter extends Document {
  _id: string; // nome da sequência (ex: 'ticketNumber')
  seq: number; // valor atual da sequência
}

// Schema simples com _id string e seq numérico
const CounterSchema: Schema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Exporta o modelo que será usado para atomically incrementar contadores
export default mongoose.model<ICounter>('Counter', CounterSchema);
