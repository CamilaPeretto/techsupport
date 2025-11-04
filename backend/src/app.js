// Importa o Express, framework para criar o servidor e gerenciar rotas
const express = require("express");

// Importa o CORS para permitir que o frontend acesse a API
const cors = require("cors");

// Importa o Helmet para adicionar cabeçalhos de segurança HTTP
const helmet = require("helmet");

// Importa o express-rate-limit, que limita o número de requisições (protege contra ataques DoS)
const rateLimit = require("express-rate-limit");

// Importa o cookie-parser para ler cookies enviados pelo cliente
const cookieParser = require("cookie-parser");

// Importa o morgan, middleware para logar requisições no terminal
const morgan = require("morgan");

// Carrega variáveis de ambiente
require("dotenv").config();

// Cria a instância principal do app Express
const app = express();

// ---------- MIDDLEWARES DE SEGURANÇA E CONFIGURAÇÃO ----------

// Adiciona o Helmet para proteger contra vulnerabilidades básicas
app.use(helmet());

// Libera o acesso da API para qualquer origem (idealmente, em produção, deve ser restrito)
app.use(cors({ origin: "*", credentials: true }));

// Habilita o parsing de JSON no corpo das requisições (req.body)
app.use(express.json());

// Habilita o uso de cookies nas requisições
app.use(cookieParser());

// Loga requisições HTTP no terminal no formato "dev" (ex: GET /api 200 32ms)
app.use(morgan("dev"));

// ---------- RATE LIMITING ----------
// Configura um limite de 100 requisições por IP a cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // tempo do intervalo (15 minutos)
  max: 100, // número máximo de requisições
  message: "Muitas requisições — tente novamente mais tarde.",
});

// Aplica o limitador a todas as rotas da API
app.use(limiter);

// ---------- ROTAS BÁSICAS ----------
// Rota inicial apenas para teste, retorna mensagem de status
app.get("/", (req, res) => {
  res.status(200).json({ message: "API TechSupport online!" });
});

// Exporta o app para ser usado em server.js
module.exports = app;
