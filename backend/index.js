const express = require('express');
const cors = require('cors');
const { users } = require('./users');

const app = express();

// Ativa o CORS globalmente
app.use(cors());

// Ativa o express json para interpretar JSON no corpo das requisições
app.use(express.json());


// Cria a rota de Login
app.post("/login", function (req, res) {

    // Extrai nome e senha do corpo da requisição
    var name = req.body.name;
    var password = req.body.password;

    // imprimi a tentativa de login no console
    console.log("Tentativa de login:", name, password);

    // Busca o usuário na lista de usuários
    var user = users.find(function(u) {
        return u.name === name && u.password === password;
    });

    // Se o usuário não for encontrado, retorna erro 401
    if (!user) {
        return res.status(401).json({ message: 'Usuario ou senha inválidos'});
    }

    // Retorna o papel do usuário autenticado
    return res.json({role: user.role });

});

app.listen(3000, function () {
    console.log('TechSupport backend rodando na porta 3000');
});