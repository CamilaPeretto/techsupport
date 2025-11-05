import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import User from '../models/User';

dotenv.config();

async function main() {
  const email = 'lukka@email.com';
  const name = 'Lukka';
  const plainPassword = '123456';

  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Verifica se já existe
    let user = await User.findOne({ email });

    if (user) {
      console.log(`Usuário já existe (${email}). Atualizando papel para 'tech' e senha...`);
      user.name = name;
      user.role = 'tech';
      user.password = hashedPassword;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'tech',
      });
    }

  console.log('✅ Técnico garantido com sucesso:');
  console.log({ id: (user._id as any).toString(), name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('❌ Erro ao criar/atualizar técnico:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

main();
