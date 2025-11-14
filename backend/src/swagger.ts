import swaggerUi from 'swagger-ui-express';

// Manual OpenAPI spec for TechSupport backend
// Keep in sync with controllers and routes in src/
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TechSupport API',
    version: '1.0.0',
    description: 'API de suporte técnico — documentação gerada manualmente para uso em sala/avaliação.',
  },
  servers: [
    { url: process.env.BASE_URL || 'http://localhost:5000', description: 'Servidor local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: ['string', 'object'] },
        },
      },
      Register: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          role: { type: 'string', enum: ['user', 'tech'] },
        },
      },
      Login: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' },
          department: { type: 'string' },
          position: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Ticket: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          ticketNumber: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string' },
          type: { type: 'string' },
          priority: { type: 'string' },
          userId: { $ref: '#/components/schemas/User' },
          assignedTo: { $ref: '#/components/schemas/User' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTicket: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['baixa', 'média', 'alta'] },
          type: { type: 'string', enum: ['hardware', 'software', 'rede', 'outros'] },
        },
      },
      UpdateStatus: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['aberto', 'em andamento', 'concluído'] },
          resolution: { type: 'string' },
        },
      },
      AssignPayload: {
        type: 'object',
        required: ['assignedTo'],
        properties: {
          assignedTo: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cria um novo usuário (registro).',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Register' } } } },
        responses: {
          '201': { description: 'Usuário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          '400': { description: 'Requisição inválida', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica usuário e retorna JWT.',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } },
        responses: {
          '200': { description: 'Login OK', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, user: { $ref: '#/components/schemas/User' } } } } } },
          '401': { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/me': {
      get: {
        tags: ['Users'],
        summary: 'Retorna usuário autenticado (token Bearer).',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Usuário atual', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          '401': { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Lista usuários (requer autenticação).',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Lista de usuários', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Recupera usuário por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Usuário', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
      },
      put: {
        tags: ['Users'],
        summary: 'Atualiza usuário (name, email, password).',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { '200': { description: 'Perfil atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
      },
    },
    '/api/tickets': {
      post: {
        tags: ['Tickets'],
        summary: 'Cria um novo ticket (requer autenticação).',
        security: [{ bearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTicket' } } } },
        responses: { '201': { description: 'Ticket criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } } },
      },
      get: {
        tags: ['Tickets'],
        summary: 'Lista tickets (filtros opcionais).',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'assignedTo', in: 'query', schema: { type: 'string' } },
          { name: 'userId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'fromDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'toDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: { '200': { description: 'Lista de tickets', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } } } } } },
      },
    },
    '/api/tickets/{id}': {
      get: {
        tags: ['Tickets'],
        summary: 'Recupera ticket por ID.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Ticket', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } } },
      },
      delete: {
        tags: ['Tickets'],
        summary: 'Deleta ticket (requer role tech).',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Ticket deletado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } } },
      },
    },
    '/api/tickets/{id}/status': {
      put: {
        tags: ['Tickets'],
        summary: 'Atualiza status do ticket (requer role tech).',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStatus' } } } },
        responses: { '200': { description: 'Status atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } } },
      },
    },
    '/api/tickets/{id}/assign': {
      put: {
        tags: ['Tickets'],
        summary: 'Atribui ticket a técnico (requer role tech).',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignPayload' } } } },
        responses: { '200': { description: 'Ticket atribuído', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } } },
      },
    },
  },
};

export { swaggerUi, swaggerSpec };
export default swaggerSpec;
