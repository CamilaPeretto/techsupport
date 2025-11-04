// Importa o app configurado do arquivo app.ts
import app from "./app";
// Importa a função de conexão com o banco de dados
import connectDB from "./config/db";

// Define a porta do servidor, vinda do .env ou padrão 3000
const PORT = process.env.PORT || 3000;

// IIFE (Immediately Invoked Function Expression)
// Função assíncrona autoexecutável que conecta ao banco e inicia o servidor
(async () => {
  try {
    // Tenta conectar ao MongoDB
    await connectDB();

    // Se a conexão for bem-sucedida, inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor TechSupport rodando na porta ${PORT}`);
      console.log(`📍 Acesse: http://localhost:${PORT}`);
    });
  } catch (err) {
    // Se algo falhar, mostra o erro e encerra
    console.error("💥 Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
})();
