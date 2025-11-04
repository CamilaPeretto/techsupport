// Importa o mongoose, biblioteca para conectar e interagir com o MongoDB
import mongoose from "mongoose";
// Carrega variáveis de ambiente do arquivo .env
import dotenv from "dotenv";

dotenv.config();

// Define uma configuração do mongoose para evitar warnings de consultas antigas
mongoose.set("strictQuery", true);

// Lê o usuário e senha do banco de dados do arquivo .env
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Função assíncrona para conectar ao MongoDB
async function connectDB(): Promise<void> {
  try {
    // Faz a conexão com o banco no MongoDB Atlas usando credenciais e URI
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cb7ikw0.mongodb.net/techsupport?retryWrites=true&w=majority&appName=Cluster0`
    );
    // Se der certo, exibe uma mensagem no console
    console.log("Conectou ao banco de dados!");
  } catch (error) {
    // Se der erro, exibe o erro e encerra a aplicação
    console.error("Erro ao conectar no banco:", error);
    process.exit(1); // força o encerramento do processo
  }
}

// Exporta a função para ser usada em outro arquivo (server.js)
export default connectDB;
