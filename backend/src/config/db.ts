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
    // Tenta conectar ao MongoDB Atlas
    // Suporta múltiplas strings de conexão
    const mongoUri = process.env.MONGODB_URI || 
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cb7ikw0.mongodb.net/techsupport?retryWrites=true&w=majority&appName=Cluster0`;
    
    await mongoose.connect(mongoUri);
    
    console.log("✅ Conectado ao banco de dados!");
  } catch (error) {
    // Se der erro, exibe o erro e encerra a aplicação
    console.error("❌ Erro ao conectar no banco:", error);
    process.exit(1);
  }
}

// Exporta a função para ser usada em outro arquivo
export default connectDB;
