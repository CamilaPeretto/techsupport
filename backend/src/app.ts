import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import auth from "./middleware/auth";

dotenv.config();

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições — tente novamente mais tarde.",
});

app.use(limiter);

app.use("/api", userRoutes);
// Rotas de tickets (única rota canonical)
app.use("/api/tickets", auth, ticketRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "API TechSupport online! 🚀" });
});

export default app;
