// Importa o app configurado do arquivo app.js
import app from "./app";
// Importa a função de conexão com o banco de dados
import connectDB from "./config/db";

// Define a porta do servidor, vinda do .env ou padrão 5000
const PORT = process.env.PORT || 5000;

// IIFE (Immediately Invoked Function Expression)
// Função assíncrona autoexecutável que conecta ao banco e inicia o servidor
(async () => {
  try {
    // Tenta conectar ao MongoDB
    await connectDB();

    // Se a conexão for bem-sucedida, inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    // Se algo falhar (ex: erro no banco), mostra o erro e encerra
    console.error("💥 Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
})();
