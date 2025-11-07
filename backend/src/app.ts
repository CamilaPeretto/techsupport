// Importação do framework Express e tipos úteis
import express, { Express, Request, Response } from "express";
// Cors para controle de origem, Helmet para cabeçalhos de segurança
import cors from "cors";
import helmet from "helmet";
// Rate limiter para proteger contra abuso de requests
import rateLimit from "express-rate-limit";
// Cookie parser para ler cookies, morgan para logging de requisições
import cookieParser from "cookie-parser";
import morgan from "morgan";
// dotenv para carregar variáveis de ambiente do .env
import dotenv from "dotenv";
// Importa os roteadores da aplicação
import userRoutes from "./routes/userRoutes";
import ticketRoutes from "./routes/ticketRoutes";
// Middleware de autenticação (verifica JWT no header)
import auth from "./middleware/auth";

// Carrega variáveis de ambiente (ex: PORT, JWT_SECRET, credenciais DB)
dotenv.config();

// Inicializa a aplicação Express e tipa a variável como Express
const app: Express = express();

// Middlewares globais
app.use(helmet()); // adiciona cabeçalhos de segurança
// Configura CORS. Atualmente permite qualquer origem — revisar para produção.
app.use(cors({ origin: "*", credentials: true }));
// Permite parsing de JSON no corpo das requisições
app.use(express.json());
// Parse de cookies caso seja necessário ler cookies HTTP
app.use(cookieParser());
// Logger de requisições (dev -> formatação compacta)
app.use(morgan("dev"));

// Limiter de requisições para evitar abuso (100 requests por 15 minutos)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: "Muitas requisições — tente novamente mais tarde.",
});

// Aplica o rate limiter globalmente
app.use(limiter);

// Rotas públicas/sem middleware: autenticação e registro/login estão em userRoutes
app.use("/api", userRoutes);
// Rotas de tickets protegidas por middleware de auth (checa JWT)
// Observação: auth valida o token presente em Authorization: Bearer <token>
app.use("/api/tickets", auth, ticketRoutes);

// Rota raiz apenas para healthcheck / verificação rápida
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "API TechSupport online! 🚀" });
});

// Exporta a instância do app para ser usada pelo servidor (server.ts)
export default app;
