# TechSupport

Plataforma web para abertura e gerenciamento de chamados técnicos com autenticação JWT e controle de permissões baseado em funções (RBAC).

---

## 🚀 Tecnologias

### Frontend
- React 19 + Vite 7
- React Router 7 (com rotas protegidas)
- Redux Toolkit 2 + React-Redux 9
- Axios (com interceptors JWT)
- Bootstrap 5 + React-Bootstrap
- ESLint (flat config) + TypeScript

### Backend
- Node.js + Express 5
- TypeScript 5 + ts-node/nodemon
- MongoDB + Mongoose 8
- **Autenticação:** JWT (jsonwebtoken), bcrypt
- **Segurança:** CORS, helmet, express-rate-limit
- **Middleware:** auth, requireTech para controle de acesso
- dotenv, morgan, cookie-parser

---

## 📁 Estrutura (simplificada)

```
techsupport/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ server.ts
│  │  ├─ config/
│  │  │  └─ db.ts
│  │  ├─ models/
│  │  │  ├─ User.ts         # Schema com roles: tech | user
│  │  │  └─ Ticket.ts       # type, resolution, resolvedAt
│  │  ├─ controllers/
│  │  │  ├─ userController.ts
│  │  │  └─ ticketController.ts
│  │  ├─ middleware/
│  │  │  ├─ auth.ts         # Valida JWT
│  │  │  └─ requireTech.ts  # Verifica role tech
│  │  ├─ routes/
│  │  │  ├─ userRoutes.ts
│  │  │  └─ ticketRoutes.ts # Rotas protegidas com middleware
│  │  └─ types/
│  │     └─ express.d.ts    # Extensão do Request
│  ├─ .env.example
│  ├─ package.json
│  └─ tsconfig.json
│
└─ frontend/
	 ├─ src/
	 │  ├─ main.tsx
	 │  ├─ App.tsx             # Rotas com ProtectedRoute
	 │  ├─ services/
	 │  │  └─ api.ts           # Axios com interceptor
	 │  ├─ store/
	 │  │  ├─ authSlice.ts
	 │  │  └─ ticketsSlice.ts
	 │  ├─ routes/
	 │  │  └─ ProtectedRoute.tsx
	 │  ├─ hooks/
	 │  │  └─ useRedux.ts
	 │  ├─ pages/
	 │  │  ├─ Tickets.tsx      # Lista com filtros
	 │  │  ├─ MyTickets.tsx
	 │  │  └─ TicketDetail.tsx
	 │  └─ components/
	 │     ├─ login/
	 │     ├─ tickets/
	 │     │  └─ AssignModal.tsx
	 │     └─ StatusUpdateModal/
	 ├─ index.html
	 ├─ package.json
	 └─ vite.config.js
```

---

## 🔐 Sistema de Permissões

O sistema implementa dois níveis de acesso:

### **Usuário (user)** - Padrão
- ✅ Criar tickets
- ✅ Visualizar seus próprios tickets
- ✅ Ver detalhes dos seus tickets
- ❌ Não pode atualizar status
- ❌ Não pode atribuir tickets

### **Técnico (tech)** - Avançado
- ✅ Visualizar todos os tickets
- ✅ Atualizar status de qualquer ticket
- ✅ Atribuir tickets para si ou outros técnicos
- ✅ Adicionar resolução e observações
- ✅ Deletar tickets

📖 **Documentação completa:** Veja [PERMISSIONS.md](./PERMISSIONS.md) para detalhes de implementação, exemplos de API e fluxos de teste.

---

## 🛠️ Scripts principais

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

## ⚙️ Variáveis de ambiente (backend)

Crie o arquivo `backend/.env` a partir de `backend/.env.example`.

```env
# Opção A: Usuário e senha do cluster (MongoDB Atlas)
DB_USER=seu_usuario
DB_PASS=sua_senha

# Opção B: URI completa (alternativa)
MONGODB_URI=mongodb+srv://...

# Servidor
PORT=3000
NODE_ENV=development

# Autenticação JWT (obrigatório)
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
```

⚠️ **Importante:** `JWT_SECRET` deve ser uma string longa e aleatória para segurança em produção.

---

## 🚀 Como rodar

### 1️⃣ Instalar dependências

```bash
# Na raiz do projeto
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2️⃣ Configurar ambiente

Crie o arquivo `backend/.env` com as variáveis necessárias (veja seção acima).

### 3️⃣ Desenvolvimento

```bash
# Da raiz do projeto (inicia backend + frontend)
npm run dev
```

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

### 4️⃣ Build de produção

```bash
npm --prefix backend run build
npm --prefix frontend run build
```

---

## 📡 API (endpoints principais)

### Autenticação
- `POST /api/register` – Cadastro de usuário (role = "user" padrão)
- `POST /api/login` – Login (retorna token JWT)

### Usuários
- `GET /api/users` – Lista usuários (protegida, requer auth)
- `GET /api/users/:id` – Busca usuário por ID (protegida)
- `PUT /api/users/:id` – Atualiza usuário (protegida)

### Tickets
| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| `POST` | `/api/tickets` | Usuários + Técnicos | Criar ticket |
| `GET` | `/api/tickets` | Usuários (próprios) / Técnicos (todos) | Listar tickets |
| `GET` | `/api/tickets/:id` | Usuários (próprios) / Técnicos (todos) | Buscar por ID |
| `PUT` | `/api/tickets/:id/status` | **Apenas Técnicos** | Atualizar status |
| `PUT` | `/api/tickets/:id/assign` | **Apenas Técnicos** | Atribuir ticket |
| `DELETE` | `/api/tickets/:id` | **Apenas Técnicos** | Deletar ticket |

🔑 **Todas as rotas de tickets requerem:** `Authorization: Bearer <token>`

---

## ✨ Funcionalidades implementadas

### Backend
- ✅ Autenticação JWT (1h de expiração)
- ✅ Middleware de autenticação (`auth`)
- ✅ Middleware de autorização (`requireTech`)
- ✅ Controle de acesso baseado em roles (RBAC)
- ✅ Filtros de tickets (status, prioridade, tipo, data)
- ✅ Registro de resolução com timestamp
- ✅ Histórico de observações (resolutionNotes)
- ✅ Validação de propriedade de tickets

### Frontend
- ✅ Login com redirecionamento inteligente
- ✅ Rotas protegidas (ProtectedRoute)
- ✅ Interceptor Axios para injetar token
- ✅ Formulário de criação de conta
- ✅ Filtros avançados na listagem
- ✅ Modal de atribuição de técnicos
- ✅ Modal de atualização de status com resolução
- ✅ Página de detalhes do ticket
- ✅ Interface responsiva com Bootstrap

---

## 🧪 Testes rápidos

### Criar usuário
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@teste.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@teste.com","password":"123456"}'
# Retorna: { "token": "...", "user": {...} }
```

### Criar ticket
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"title":"PC não liga","description":"Tela preta","priority":"alta","type":"hardware"}'
```

### Listar tickets (como usuário)
```bash
curl http://localhost:3000/api/tickets \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
# Retorna apenas tickets do usuário autenticado
```

---

## 📝 Notas importantes

### Criar conta de técnico

Por segurança, não existe endpoint público para criar técnicos. Opções:

**Opção 1: Atualizar via MongoDB**
```javascript
db.users.updateOne(
  { email: "tecnico@empresa.com" },
  { $set: { role: "tech" } }
)
```

**Opção 2: Script de seed**
Crie um usuário e atualize o role manualmente no banco.

---

## 🔮 Próximos passos sugeridos

- [ ] Testes unitários e de integração (Jest)
- [ ] Endpoint administrativo para criar técnicos
- [ ] Notificações em tempo real (WebSocket)
- [ ] Upload de anexos nos tickets
- [ ] Dashboard com métricas e gráficos
- [ ] Sistema de SLA por prioridade
- [ ] Chat interno entre usuário e técnico
- [ ] Avaliação do atendimento
- [ ] Logs de auditoria

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request