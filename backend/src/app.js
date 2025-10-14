const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Segurança e middlewares
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Limite de requisições (proteção básica)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: "Muitas requisições — tente novamente mais tarde.",
});
app.use(limiter);

// Rotas (placeholder)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API TechSupport online!" });
});

module.exports = app;
