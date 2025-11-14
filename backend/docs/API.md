# Documentação da API TechSupport

Esta documentação descreve os endpoints da API TechSupport (backend).

Base URL (desenvolvimento): `http://localhost:5000`

Autenticação
------------
A API usa JWT em Bearer token para rotas protegidas. Enviar o header:

Authorization: Bearer <token>

O token é obtido no endpoint `/api/login`.

Principais recursos
-------------------
- Autenticação: `/api/register`, `/api/login`, `/api/me`
- Usuários: `/api/users`, `/api/users/:id`
- Tickets: `/api/tickets`, `/api/tickets/:id`, `/api/tickets/:id/status`, `/api/tickets/:id/assign`

Exemplos de uso
---------------
1) Registrar usuário

POST /api/register
Content-Type: application/json

{
  "name": "João",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "role": "user" // opcional: 'user' ou 'tech'
}

Resposta: 201
{
  "message": "Usuário criado com sucesso",
  "user": { "id": "...", "name": "João", "email": "joao@exemplo.com", "role": "user" }
}

2) Login

POST /api/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senha123"
}

Resposta: 200
{
  "message": "Login realizado com sucesso",
  "token": "<JWT>",
  "user": { "id": "...", "name": "João", "email": "joao@...", "role": "user" }
}

3) Criar ticket

POST /api/tickets
Headers: Authorization: Bearer <token>
Body JSON:
{
  "title": "Computador não liga",
  "description": "Ao pressionar o botão não há resposta",
  "priority": "alta",
  "type": "hardware"
}

Resposta: 201 (ticket criado)

4) Listar tickets (filtros)

GET /api/tickets?status=aberto&priority=alta
Headers: Authorization: Bearer <token>

Resposta: 200 (array de tickets)

5) Atualizar status (apenas técnicos)

PUT /api/tickets/:id/status
Headers: Authorization: Bearer <token-de-tecnico>
Body JSON:
{
  "status": "concluído",
  "resolution": "Substituído HD e reinstalado SO"
}

6) Atribuir ticket (apenas técnicos)

PUT /api/tickets/:id/assign
Headers: Authorization: Bearer <token-de-tecnico>
Body JSON:
{
  "assignedTo": "<userId-do-técnico>"
}

Observações e boas práticas
--------------------------
- Proteja o valor de `JWT_SECRET` em produção.
- Revise o CORS (`app.ts`) para limitar origens em produção.
- Para importar a especificação OpenAPI no Postman/Insomnia, use `http://localhost:5000/api/docs.json`.

Where to find the docs
----------------------
- Swagger UI (interativa): `http://localhost:5000/api/docs`
- Spec OpenAPI (JSON): `http://localhost:5000/api/docs.json`

Como rodar localmente
---------------------
No diretório `backend`:

```bash
npm install
npm run dev
```

Acessar `http://localhost:5000/api/docs` para a UI interativa.

---
