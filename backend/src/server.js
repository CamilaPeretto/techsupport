const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB e iniciar servidor
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error(" Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
})();
