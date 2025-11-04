// Importa o Express, framework para criar o servidor e gerenciar rotas
import express, { Express, Request, Response } from "express";
// Importa o CORS para permitir que o frontend acesse a API
import cors from "cors";
// Importa o Helmet para adicionar cabeçalhos de segurança HTTP
import helmet from "helmet";
// Importa o express-rate-limit, que limita o número de requisições
import rateLimit from "express-rate-limit";
// Importa o cookie-parser para ler cookies enviados pelo cliente
import cookieParser from "cookie-parser";
// Importa o morgan, middleware para logar requisições no terminal
import morgan from "morgan";
// Carrega variáveis de ambiente
import dotenv from "dotenv";

// Importa as rotas
import userRoutes from "./routes/userRoutes";
import ticketRoutes from "./routes/ticketRoutes";

dotenv.config();

// Cria a instância principal do app Express
const app: Express = express();

// ---------- MIDDLEWARES DE SEGURANÇA E CONFIGURAÇÃO ----------

// Adiciona o Helmet para proteger contra vulnerabilidades básicas
app.use(helmet());

// Libera o acesso da API para qualquer origem (idealmente, em produção, deve ser restrito)
app.use(cors({ origin: "*", credentials: true }));

// Habilita o parsing de JSON no corpo das requisições (req.body)
app.use(express.json());

// Habilita o uso de cookies nas requisições
app.use(cookieParser());

// Loga requisições HTTP no terminal no formato "dev"
app.use(morgan("dev"));

// ---------- RATE LIMITING ----------
// Configura um limite de 100 requisições por IP a cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições — tente novamente mais tarde.",
});

// Aplica o limitador a todas as rotas da API
app.use(limiter);

// ---------- ROTAS ----------
// Rota inicial apenas para teste
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "API TechSupport online! 🚀" });
});

// Rotas de usuários e autenticação
app.use("/api/users", userRoutes);
app.use("/api/user", userRoutes); // Alias para compatibilidade
app.use("/api/login", userRoutes); // Inclui login

// Rotas de tickets
app.use("/api/tickets", ticketRoutes);
app.use("/api/ticket", ticketRoutes); // Alias para compatibilidade

// Rota para técnicos (alias)
app.use("/api/tecnico/tickets", ticketRoutes);

// Exporta o app para ser usado em server.ts
export default app;
