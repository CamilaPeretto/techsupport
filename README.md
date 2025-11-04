# TechSupport

Plataforma web para abertura e gerenciamento de chamados técnicos, agora inteiramente em TypeScript (frontend e backend).

---

## Tecnologias

### Frontend
- React 19 + Vite 7
- React Router 7
- Redux Toolkit 2 + React-Redux 9
- Axios
- Bootstrap 5 + React-Bootstrap
- ESLint (flat config) + TypeScript

### Backend
- Node.js + Express 5
- TypeScript 5 + ts-node/nodemon
- MongoDB + Mongoose 8
- JWT (jsonwebtoken), bcrypt
- CORS, helmet, express-rate-limit, cookie-parser, morgan
- dotenv

---

## Estrutura (simplificada)

```
techsupport/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ server.ts
│  │  ├─ config/
│  │  │  └─ db.ts
│  │  ├─ models/
│  │  │  ├─ User.ts
│  │  │  └─ Ticket.ts
│  │  ├─ controllers/
│  │  │  ├─ userController.ts
│  │  │  └─ ticketController.ts
│  │  └─ routes/
│  │     ├─ userRoutes.ts
│  │     └─ ticketRoutes.ts
│  ├─ .env.example
│  ├─ package.json
│  └─ tsconfig.json
│
└─ frontend/
	 ├─ src/
	 │  ├─ main.tsx
	 │  ├─ App.tsx
	 │  ├─ store/
	 │  │  └─ authSlice.ts
	 │  ├─ hooks/
	 │  │  └─ useRedux.ts
	 │  └─ components/
	 ├─ index.html
	 ├─ package.json
	 └─ vite.config.js
```

---

## Scripts principais

### Raiz
- `npm run dev` – inicia backend e frontend em paralelo (via concurrently)
- `npm run lint` – lint na raiz (projeto possui ESLint configurado no frontend)
- `npm run format` – formata com Prettier

### Backend (`backend/`)
- `npm run dev` – desenvolvimento com nodemon + ts-node
- `npm run build` – compila TypeScript para `dist/`
- `npm start` – executa `node dist/server.js`

### Frontend (`frontend/`)
- `npm run dev` – Vite em modo dev
- `npm run build` – `tsc -b` + build do Vite
- `npm run preview` – preview do build

---

## Variáveis de ambiente (backend)

Crie o arquivo `backend/.env` a partir de `backend/.env.example`.

Opção A: usuário e senha do cluster (Atlas)
```
DB_USER=seu_usuario
DB_PASS=sua_senha
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_aqui
```

Opção B: URI completa
```
MONGODB_URI=sua_uri_completa_do_mongo
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_aqui
```

Observação: por padrão, `src/config/db.ts` usa `DB_USER`/`DB_PASS`. Se preferir `MONGODB_URI`, ajuste o arquivo para ler a variável e priorizá-la.

---

## Como rodar

1) Instalar dependências nas três pastas (raiz, backend, frontend) uma vez:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

2) Criar e preencher o `backend/.env` conforme acima.

3) Ambiente de desenvolvimento (do repositório raiz):

```bash
npm run dev
```

Backend: http://localhost:3000  |  Frontend: http://localhost:5173

4) Build de produção:

```bash
npm --prefix backend run build
npm --prefix frontend run build
```

---

## API (resumo)

- `GET /` – healthcheck
- `POST /api/register` – cria usuário
- `POST /api/login` – autentica
- `GET /api/users` – lista usuários

Tickets
- `POST /api/tickets` – cria ticket
- `GET /api/tickets` – lista tickets
- `GET /api/tickets/:id` – busca por id
- `PATCH /api/tickets/:id/status` – atualiza status
- `PATCH /api/tickets/:id/assign` – atribui técnico
- `DELETE /api/tickets/:id` – remove

Obs.: Algumas rotas podem requerer JWT via header `Authorization: Bearer <token>`.

---

## Notas e próximos passos

- Branches `main` e `develop` estão sincronizadas (Tickets + TypeScript).
- Removidos arquivos legados `.js`/`.html` após migração.
- Próximos passos sugeridos:
	- Adicionar testes (unitários/integrados) no backend.
	- Configurar ESLint/TS no backend para manter padrões consistentes.
	- Implementar proteção JWT nas rotas de tickets, se aplicável.