# Tech Support

Plataforma web para abertura e gerenciamento de **chamados técnicos**, permitindo que usuários registrem problemas e técnicos acompanhem, filtrem e atualizem o status das solicitações.

---

##  Tecnologias Utilizadas

###  Front-end
- **React (Vite)**
- **React Router DOM**
- **Redux**
- **Axios**
- **Bootstrap**
- **Lucide React** (ícones)
- **ESLint + Prettier** (padrões de código)

###  Back-end
- **Node.js**
- **Express**
- **Mongoose**
- **MongoDB**
- **CORS**
- **JWT (jsonwebtoken)**
- **bcrypt** (hash de senhas)
- **dotenv**
- **helmet** (segurança HTTP)
- **express-rate-limit**
- **cookie-parser**
- **morgan** (logs)
- **validator**

---

##  Estrutura de Pastas
```
techsupport/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── models/
│ │ └── routes/
│ ├── .env
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```
---

##  Scripts Principais

### Raiz
| Comando | Descrição |
|----------|------------|
| `npm run dev` | Inicia **backend** e **frontend** simultaneamente |
| `npm run lint` | Verifica erros de padrão de código (ESLint) |
| `npm run format` | Formata automaticamente o código (Prettier) |

### Backend
| Comando | Descrição |
|----------|------------|
| `npm run dev` | Executa o servidor com nodemon |
| `npm start` | Executa o servidor normalmente |

---

##  Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na pasta `backend/` baseado no exemplo:
```
PORT=5000
MONGO_URI=sua_string_de_conexao
JWT_SECRET=um_token_secreto_seguro
```
---

##  Funcionalidades Planejadas

###  Usuário
- Login e registro com autenticação JWT  
- Abertura de chamados técnicos  
- Classificação por tipo e urgência  
- Acompanhamento do status dos chamados  

###  Técnico
- Login e registro de novos técnicos  
- Atribuição de chamados a técnicos  
- Atualização de status (“Aberto”, “Em andamento”, “Finalizado”)  
- Registro da resolução e observações  
- Filtros por data, usuário, tipo e status  

---

##  Contribuindo

1. Faça um **fork** do repositório  
2. Crie uma **branch** para sua feature  
   ```
   git checkout -b feature/nome-da-feature
   ```

3. Faça commit das alterações
    ```
    git commit -m "Adiciona nova funcionalidade"
    ```

4. Envie para o repositório remoto
    ```
    git push origin feature/nome-da-feature
    ```

## Colaboração em Tempo Real
Para desenvolvimento colaborativo:

Use VS Code + Live Share

O integrante do grupo gera o link e compartilha com os demais

Todos podem editar simultaneamente e testar em tempo real

## Equipe
Nome	Função	GitHub
Camila	Full-Stack	@Camila

| Nome | Função | Github
|----------|------------|------------|
| Augusto | Front-End | ... |
| Lukka | Front-End | ... |
| Jonathan | Back-End | ... |
| Camila | Full-Stack | CamilaPeretto |

## Design
Baseado no estilo visual do JetBrains

Paleta: Magenta #E627F8, Vermelho #FF0007, Laranja #FF841B, Preto #000, Branco #FFF

Tipografia: Fira Code (títulos) + Inter (texto)