# TechSupport

TechSupport é uma plataforma web para abertura e gerenciamento de chamados técnicos. Usuários finais podem registrar problemas (tickets) e técnicos acompanham, atribuem e resolvem as solicitações.

## Visão geral

- Usuários (role `user`) criam e acompanham seus próprios tickets.
- Técnicos (role `tech`) visualizam todos os tickets, atribuem e atualizam status.
- Autenticação via JWT; backend em Node.js/Express; frontend em React + Vite.

##  Funcionalidades implementadas

### Backend
-  Autenticação JWT (1h de expiração)
-  Middleware de autenticação (`auth`)
-  Middleware de autorização (`requireTech`)
-  Controle de acesso baseado em roles (RBAC)
-  Filtros de tickets (status, prioridade, tipo, data)
-  Registro de resolução com timestamp
-  Histórico de observações (resolutionNotes)
-  Validação de propriedade de tickets

### Frontend
-  Login com redirecionamento inteligente
-  Rotas protegidas (ProtectedRoute)
-  Interceptor Axios para injetar token
-  Formulário de criação de conta
-  Filtros avançados na listagem
-  Modal de atribuição de técnicos
-  Modal de atualização de status com resolução
-  Página de detalhes do ticket
-  Interface responsiva com Bootstrap

## Tecnologias

Frontend
- React (Vite)
- React Router DOM
- Redux Toolkit
- Axios
- Bootstrap
- Lucide (ícones)
- TypeScript

Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv, helmet, express-rate-limit, cookie-parser, morgan, validator

## Estrutura do repositório

```
techsupport/
├── LICENSE
├── package.json
├── README.md
├── PERMISSIONS.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                
│   ├── docs/               # documentação gerada/manual
│   │   ├── API.md          # documentação em português
│   │   └── openapi.json    # snapshot do OpenAPI (opcional)
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       │   └── db.ts
│       ├── controllers/
│       │   ├── ticketController.ts
│       │   └── userController.ts
│       ├── middleware/
│       │   └── auth.ts
│       ├── models/
│       │   ├── Counter.ts
│       │   ├── Ticket.ts
│       │   └── User.ts
│       ├── routes/
│       │   ├── ticketRoutes.ts
│       │   └── userRoutes.ts
│       ├── scripts/
│       │   └── updateDates.ts
│       ├── types/
│       │   └── express.d.ts
│       └── utils/
│           ├── updateTicketDates.ts
│           └── validateInput.ts
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── eslint.config.ts
    ├── index.html
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── vite-env.d.ts
        ├── assets/
        ├── components/
        │   ├── admin/
        │   │   └── NewTechModal.tsx
        │   ├── layout/
        │   │   ├── Header.tsx
        │   │   ├── Layout.tsx
        │   │   ├── RoleBasedRedirect.tsx
        │   │   └── Sidebar.tsx
        │   ├── login/
        │   │   ├── CreateAccountModal.tsx
        │   │   ├── ForgotPasswordModal.tsx
        │   │   ├── LoginErrorModal.tsx
        │   │   └── LoginForm.tsx
        │   ├── StatusUpdateModal/
        │   │   ├── index.ts
        │   │   ├── StatusUpdateModal.css
        │   │   └── StatusUpdateModal.tsx
        │   ├── tickets/
        │   │   ├── AssignModal.tsx
        │   │   ├── NewTicketModal.tsx
        │   │   ├── StatusUpdateModalSimple.tsx
        │   │   ├── TicketDetailModal.tsx
        │   │   ├── TicketRow.tsx
        │   │   └── TicketTable.tsx
        │   └── ui/
        │       ├── CustomBadge.tsx
        │       ├── StatsCard.tsx
        │       └── Table.tsx
        ├── hooks/
        │   ├── use-mobile.tsx
        │   └── useRedux.ts
        ├── pages/
        │   ├── Layout.tsx
        │   ├── Login.tsx
        │   ├── MyTickets.tsx
        │   ├── NotFound.tsx
        │   ├── Profile.tsx
        │   ├── Schedule.tsx
        │   ├── TicketDetail.tsx
        │   └── Tickets.tsx
        ├── routes/
        │   └── ProtectedRoute.tsx
        ├── services/
        │   └── api.ts
        └── store/
            ├── authSlice.ts
            ├── authThunks.ts
            ├── statusSlice.ts
            ├── store.ts
            └── ticketsSlice.ts
```

## Como rodar (desenvolvimento)

1) Instalar dependências

```bash
# na raiz
npm install

# backend
cd backend && npm install

# frontend
cd frontend && npm install
```

2) Rodar em modo dev

```bash
#script que roda ambos
npm run dev

# ou iniciar separadamente
cd backend && npm run dev
cd frontend && npm run dev
```

Visualizar documentação da API
-----------------------------

Após iniciar o backend, a documentação gerada está disponível em duas formas:

- Swagger UI (interativa): http://localhost:5000/api/docs
- Spec OpenAPI (JSON): http://localhost:5000/api/docs.json
- Documento em português (arquivo): `backend/docs/API.md`

Esses recursos permitem importar a spec em ferramentas como Postman ou Insomnia e testar endpoints diretamente pela UI do Swagger.

3) Build de produção

```bash
cd frontend && npm run build
cd backend && npm run build
```

### Variáveis de ambiente (backend)

Crie `backend/.env` com estas variáveis mínimas:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

## Design

Paleta: Magenta #E627F8, Vermelho #FF0007, Laranja #FF841B, Preto #000, Branco #FFF

Tipografia: Fira Code (títulos) + Inter (texto)

## Melhorias futuras

Estas são melhorias e funcionalidades planejadas que podem ser priorizadas conforme necessidade do produto:

- [ ] Endpoint administrativo para criar/gerenciar técnicos e roles (role: admin)
- [ ] Notificações em tempo real (WebSocket / Socket.IO) para updates de tickets
- [ ] Upload de anexos nos tickets (armazenamento S3 / local config)
- [ ] Dashboard com métricas e gráficos (tempo médio de resolução, SLA, tickets por técnico)
- [ ] Sistema de SLA por prioridade com alertas quando limiares forem atingidos
- [ ] Chat interno entre usuário e técnico dentro do ticket
- [ ] Avaliação do atendimento pelo usuário (feedback/rating)

## Contribuição

1. Fork
2. Branch: `git checkout -b feature/nome-da-feature`
3. Commit: `git commit -m "feat: descrição"`
4. Push e abra PR para `develop`

## Equipe

- Augusto — Frontend
- Lukka — Frontend
- Jonathan — Backend
- Camila — Full-Stack

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.