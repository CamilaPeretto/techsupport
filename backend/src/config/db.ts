// Mongoose: ORM/ODM para MongoDB
import mongoose from "mongoose";
// dotenv para carregar variáveis de ambiente (DB_USER, DB_PASS, etc.)
import dotenv from "dotenv";

// Carrega .env — importante antes de ler process.env
dotenv.config();

// Evita warnings ao usar consultas com certas opções (compatibilidade)
mongoose.set("strictQuery", true);

// Credenciais lidas do ambiente. Podem ser undefined em dev local.
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

/**
 * Conecta ao MongoDB usando mongoose.connect.
 * A função lança uma saída de erro e encerra o processo em caso de falha,
 * pois a aplicação depende do banco para funcionar corretamente.
 */
async function connectDB(): Promise<void> {
  try {
    // Monta a connection string para MongoDB Atlas. Em produção, valide a string
    // e evite colocar credenciais diretamente no repositório.
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cb7ikw0.mongodb.net/TechSupport?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Conectou ao banco de dados!");
  } catch (error) {
    // Em caso de erro fatal de conexão, logamos e encerramos com código 1
    console.error("Erro ao conectar no banco:", error);
    process.exit(1);
  }
}

// Exporta a função de conexão para ser usada no processo de startup
export default connectDB;
