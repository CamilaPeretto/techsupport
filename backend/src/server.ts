/// <reference path="./types/express.d.ts" />
// Importa a instância do app (configurada em src/app.ts)
import app from "./app";
// Função de conexão com o banco (mongoose)
import connectDB from "./config/db";

// A porta é lida do .env (ex: process.env.PORT) ou usa 5000 por padrão
const PORT = process.env.PORT || 5000;

// IIFE (Immediately Invoked Function Expression)
// Usamos uma função async autoexecutável para poder usar await no startup
(async () => {
  try {
    // 1) Conecta ao banco de dados (MongoDB Atlas ou local)
    await connectDB();

    // 2) Se conexão ok, inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    // Em caso de erro ao conectar/iniciar, loga e encerra o processo
    console.error("💥 Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
})();
