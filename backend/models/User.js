// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Técnico', 'Funcionário'], required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
