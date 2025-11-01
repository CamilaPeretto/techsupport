// database.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://jonathan:1234@cluster0.h3hwiyv.mongodb.net/techsupport?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Conectado ao MongoDB Atlas');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
  }
}

module.exports = connectDB;
