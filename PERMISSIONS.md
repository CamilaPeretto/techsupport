# Sistema de Permissões - TechSupport

## Visão Geral

O sistema implementa controle de acesso baseado em funções (RBAC) com dois tipos de usuários:

### 1. **Usuário (user)** - Role padrão
- Pode criar tickets
- Pode visualizar apenas seus próprios tickets
- Pode visualizar detalhes apenas dos seus próprios tickets

### 2. **Técnico (tech)** - Role especial
- Pode visualizar todos os tickets do sistema
- Pode atualizar o status de qualquer ticket
- Pode atribuir tickets para si mesmo ou outros técnicos
- Pode deletar tickets

## Implementação Técnica

### Middleware de Autenticação

**Arquivo:** `backend/src/middleware/auth.ts`

Valida o token JWT e adiciona o usuário ao objeto `req.user`:
```typescript
req.user = { id: string, role?: string }
```

### Middleware de Autorização

**Arquivo:** `backend/src/middleware/requireTech.ts`

Middleware que verifica se o usuário é técnico. Retorna erro 403 se não for.

### Rotas Protegidas

**Arquivo:** `backend/src/routes/ticketRoutes.ts`

| Rota | Método | Middleware | Permissão |
|------|--------|-----------|-----------|
| `/api/tickets` | POST | `auth` | Usuários e Técnicos |
| `/api/tickets` | GET | `auth` | Usuários (próprios) / Técnicos (todos) |
| `/api/tickets/:id` | GET | `auth` | Usuários (próprios) / Técnicos (todos) |
| `/api/tickets/:id/status` | PUT | `auth` + `requireTech` | Apenas Técnicos |
| `/api/tickets/:id/assign` | PUT | `auth` + `requireTech` | Apenas Técnicos |
| `/api/tickets/:id` | DELETE | `auth` + `requireTech` | Apenas Técnicos |

### Lógica de Controle nos Controllers

#### createTicket
- Usa `req.user.id` automaticamente como `userId`
- Não permite especificar `userId` manualmente (segurança)

#### getAllTickets
- **Usuários:** Filtra automaticamente por `userId = req.user.id`
- **Técnicos:** Pode filtrar por qualquer `userId` ou `assignedTo`

#### getTicketById
- **Usuários:** Verifica se `ticket.userId === req.user.id`
- **Técnicos:** Pode ver qualquer ticket

#### updateTicketStatus, assignTicket, deleteTicket
- Protegidos por `requireTech` middleware
- Apenas técnicos podem executar

## Configuração de Contas

### Criar Usuário Normal
```bash
POST /api/register
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```
Role será `"user"` por padrão.

### Criar Técnico
Para criar um técnico, é necessário alterar o role diretamente no banco de dados ou criar um endpoint administrativo separado.

**Exemplo via MongoDB:**
```javascript
db.users.updateOne(
  { email: "tecnico@exemplo.com" },
  { $set: { role: "tech" } }
)
```

Ou criar o usuário diretamente com role tech:
```javascript
db.users.insertOne({
  name: "Maria Técnica",
  email: "maria.tech@exemplo.com",
  password: "$2b$10$...", // hash bcrypt
  role: "tech",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Fluxo de Trabalho

### Fluxo do Usuário
1. Registra-se no sistema (role = "user")
2. Faz login e recebe token JWT
3. Cria tickets descrevendo problemas
4. Visualiza status dos seus tickets
5. Vê detalhes e resoluções quando finalizados

### Fluxo do Técnico
1. Faz login com conta de técnico (role = "tech")
2. Visualiza todos os tickets em aberto
3. Filtra por prioridade, tipo, status
4. Atribui um ticket para si mesmo
5. Atualiza o status conforme trabalha
6. Marca como "Concluído" com resolução e observações

## Segurança

### Validações Implementadas
- ✅ Token JWT obrigatório para todas as operações de tickets
- ✅ Usuários não podem ver tickets de outros usuários
- ✅ Usuários não podem atualizar status ou atribuir tickets
- ✅ Técnicos têm acesso total controlado pelo middleware
- ✅ CreateTicket usa ID do token, não do body (previne spoofing)

### Headers Necessários
```
Authorization: Bearer <token-jwt>
```

### Estrutura do Token JWT
```json
{
  "sub": "userId",
  "role": "user" | "tech",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## Testes de Permissões

### Teste 1: Usuário cria ticket
```bash
POST /api/tickets
Authorization: Bearer <user-token>
{
  "title": "Computador não liga",
  "description": "Tela preta após ligar",
  "priority": "alta",
  "type": "hardware"
}
```
✅ Sucesso - ticket criado com userId do token

### Teste 2: Usuário lista tickets
```bash
GET /api/tickets
Authorization: Bearer <user-token>
```
✅ Sucesso - retorna apenas tickets do usuário

### Teste 3: Usuário tenta atualizar status
```bash
PUT /api/tickets/:id/status
Authorization: Bearer <user-token>
{
  "status": "concluído"
}
```
❌ Erro 403 - Acesso negado (requireTech)

### Teste 4: Técnico lista todos os tickets
```bash
GET /api/tickets
Authorization: Bearer <tech-token>
```
✅ Sucesso - retorna todos os tickets

### Teste 5: Técnico atribui ticket
```bash
PUT /api/tickets/:id/assign
Authorization: Bearer <tech-token>
{
  "assignedTo": "techUserId"
}
```
✅ Sucesso - ticket atribuído e status muda para "em andamento"

### Teste 6: Técnico atualiza status
```bash
PUT /api/tickets/:id/status
Authorization: Bearer <tech-token>
{
  "status": "concluído",
  "resolution": "Problema resolvido trocando fonte de alimentação"
}
```
✅ Sucesso - status atualizado com resolução e timestamp

## Extensões Futuras

### Possíveis Melhorias
- [ ] Role "admin" para gerenciar usuários e técnicos
- [ ] Endpoint `/api/admin/users/:id/role` para alterar roles
- [ ] Histórico de alterações de status
- [ ] Notificações quando ticket é atualizado
- [ ] Chat interno entre usuário e técnico no ticket
- [ ] SLA (Service Level Agreement) por prioridade
- [ ] Dashboard com métricas para técnicos
- [ ] Avaliação do atendimento pelo usuário
