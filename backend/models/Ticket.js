// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['aberto', 'em andamento', 'concluído'], default: 'aberto' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
