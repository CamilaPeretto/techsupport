import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { updateTicketDates } from '../utils/updateTicketDates';

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const MONGODB_URI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cb7ikw0.mongodb.net/TechSupport?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB!');

    await updateTicketDates();

    console.log('🎉 Script concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar script:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
    process.exit(0);
  }
}

main();
