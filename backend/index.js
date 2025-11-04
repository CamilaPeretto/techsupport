// index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const mongoose = require('mongoose');

const app = express();

// Conecta ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Rota de login
app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  console.log("Tentativa de login:", name, password);

  const user = await User.findOne({ name, password });

  if (!user) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }

  return res.json({ role: user.role });
});

// 🔹 Rota para criar novo usuário

// Criar novo usuário
app.post("/user", async (req, res) => {
  const { name, password, role } = req.body;

  try {
    const novoUser = new User({ name, password, role });
    await novoUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso", user: novoUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
});


// 🔹 Rota para criar novo ticket
app.post("/ticket", async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const newTicket = new Ticket({ title, description, userId });
    await newTicket.save();
    res.status(201).json({ message: "Ticket criado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar ticket", error });
  }
});

// Rota para listar tickets no painel do técnico
app.get("/tecnico/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tickets", error });
  }
});

app.listen(3000, () => {
  console.log('🚀 TechSupport backend rodando na porta 3000');
});

app.put("/ticket/:id/status", async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  try {
    // verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "ID do ticket inválido" });
    }

    // atualiza o status
    const ticketAtualizado = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    if (!ticketAtualizado) {
      return res.status(404).json({ message: "Ticket não encontrado" });
    }

    res.json({ message: "Status atualizado com sucesso", ticket: ticketAtualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar status", error });
  }
});



