# VittaCash 💰

Sistema de Controle de Gastos Pessoais desenvolvido com Next.js 16, NextAuth.js, Prisma e PostgreSQL.

---

## 📋 Características

- ✅ Autenticação via Google OAuth (NextAuth.js)
- ✅ CRUD completo de despesas
- ✅ Filtros por mês, ano e categoria
- ✅ Relatórios mensais e anuais
- ✅ Exportação/Importação de dados em CSV
- ✅ Suporte a despesas recorrentes (mensal/anual)
- ✅ Validação de dados server-side e client-side
- ✅ Interface responsiva e moderna
- ✅ Banco de dados com Prisma ORM (PostgreSQL)
- ✅ Testes automatizados com Jest

---

## 🚀 Tecnologias

### Frontend
- **Next.js 16** (App Router)
- **React 19** com React Compiler
- **CSS Modules** para estilização
- **Axios** para requisições HTTP

### Backend/API
- **Next.js API Routes** (Route Handlers)
- **NextAuth.js 4.24** para autenticação OAuth
- **Prisma 5.7** como ORM
- **PostgreSQL** (Supabase)

### Desenvolvimento
- **ESLint** + **Prettier** para código limpo
- **Jest** + **React Testing Library** para testes
- **Formidable** para upload de arquivos

---

## 📁 Estrutura do Projeto

```
vittacash/
├── src/
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.js      # Configuração NextAuth
│   │   │   ├── expenses/
│   │   │   │   ├── route.js          # GET (listar) e POST (criar)
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js      # GET, PUT, DELETE (individual)
│   │   │   │   ├── export/
│   │   │   │   │   └── route.js      # Exportar CSV
│   │   │   │   ├── import/
│   │   │   │   │   └── route.js      # Importar CSV
│   │   │   │   └── report/
│   │   │   │       └── route.js      # Relatórios mensais/anuais
│   │   │   └── health/
│   │   │       └── route.js          # Health check
│   │   ├── auth/                     # Páginas de autenticação
│   │   │   ├── login/
│   │   │   ├── cadastro/
│   │   │   ├── verificar-email/
│   │   │   └── reenviar-verificacao/
│   │   ├── components/               # Componentes React
│   │   │   ├── authButton/
│   │   │   ├── authProvider/
│   │   │   ├── expenseForm/
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   ├── hero/
│   │   │   ├── layout/
│   │   │   ├── loginButton/
│   │   │   ├── navbar/
│   │   │   └── sessionProvider/
│   │   ├── expenses/                 # Páginas de despesas
│   │   │   ├── page.js              # Lista de despesas
│   │   │   ├── new/
│   │   │   │   └── page.js          # Nova despesa
│   │   │   └── [id]/
│   │   │       └── page.js          # Editar despesa
│   │   ├── reports/
│   │   │   └── page.js              # Página de relatórios
│   │   ├── layout.js                # Layout raiz
│   │   ├── page.js                  # Página inicial (dashboard)
│   │   └── globals.css              # Estilos globais
│   ├── lib/
│   │   ├── prisma.js                # Cliente Prisma
│   │   └── validacoes.js            # Funções de validação
│   ├── prisma/
│   │   └── schema.prisma            # Schema do banco de dados
│   └── services/
│       └── api.js                   # Serviços de API (axios)
├── __tests__/                       # Testes
│   ├── api/
│   │   └── expenses.test.js
│   └── components/
│       └── ExpenseForm.test.jsx
├── pages/                           # Legacy (mantido para compatibilidade)
│   └── api/
│       └── expenses/
│           └── index.js
├── public/                          # Arquivos estáticos
├── jest.config.js                   # Configuração Jest
├── jest.setup.js                    # Setup dos testes
├── next.config.mjs                  # Configuração Next.js
├── eslint.config.mjs                # Configuração ESLint
├── package.json
└── README.md
```

---

## 🔌 API Routes

### Autenticação
- `POST /api/auth/signin` - Login com Google OAuth
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Obter sessão atual

### Despesas (CRUD)
- `GET /api/expenses` - Listar despesas (com filtros: month, year, from, to, category)
- `POST /api/expenses` - Criar nova despesa
- `GET /api/expenses/:id` - Buscar despesa por ID
- `PUT /api/expenses/:id` - Atualizar despesa
- `DELETE /api/expenses/:id` - Excluir despesa

### Relatórios e Exportação
- `GET /api/expenses/report?type=monthly&year=2025&month=11` - Relatório mensal
- `GET /api/expenses/report?type=yearly&year=2025` - Relatório anual
- `GET /api/expenses/export?month=11&year=2025` - Exportar CSV
- `POST /api/expenses/import` - Importar CSV (multipart/form-data)

### Utilidades
- `GET /api/health` - Health check da aplicação

---

## 🗄️ Modelo de Dados (Prisma)

### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  expenses      Expense[]
}
```

### Expense
```prisma
model Expense {
  id             String          @id @default(cuid())
  userId         String
  title          String
  amount         Float
  date           DateTime
  category       String
  recurring      Boolean         @default(false)
  recurrenceType String          @default("NONE") // NONE, MONTHLY, YEARLY
  notes          String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, date])
  @@index([userId, category])
}
```

---

## ⚙️ Setup Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados PostgreSQL (Supabase)
DATABASE_URL="postgresql://usuario:senha@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aleatoria"

# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# API (opcional para dev)
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3. Sincronizar banco de dados
```bash
npm run prisma:push
```

ou manualmente:
```bash
npx prisma db push --schema=./src/prisma/schema.prisma
```

### 4. Iniciar desenvolvimento
```bash
npm run dev
```

Abrir: http://localhost:3000

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Cobertura de código
npm run test:coverage
```

---

## � Scripts Disponíveis

```json
{
  "dev": "next dev",                          // Servidor desenvolvimento
  "build": "next build",                      // Build produção
  "start": "next start",                      // Servidor produção
  "lint": "eslint . --ext .js,.jsx",         // Verificar código
  "lint:fix": "eslint . --ext .js,.jsx --fix", // Corrigir código
  "test": "jest",                            // Rodar testes
  "test:watch": "jest --watch",              // Testes modo watch
  "test:coverage": "jest --coverage",        // Cobertura de testes
  "prisma:migrate": "prisma migrate dev --schema=./src/prisma/schema.prisma",
  "prisma:studio": "prisma studio --schema=./src/prisma/schema.prisma",
  "prisma:generate": "prisma generate --schema=./src/prisma/schema.prisma",
  "prisma:push": "prisma db push --schema=./src/prisma/schema.prisma"
}
```

---

## 🧩 Componentes Principais

### Componentes de UI
- **Header** - Cabeçalho com título e descrição
- **Hero** - Seção hero da landing page
- **Footer** - Rodapé da aplicação
- **Navbar** - Barra de navegação principal
- **Layout** - Layout wrapper global

### Componentes de Autenticação
- **AuthButton** - Botão de autenticação (login/logout)
- **LoginButton** - Botão específico de login
- **SessionProvider** - Provider de sessão NextAuth
- **AuthProvider** - Provider de autenticação customizado

### Componentes de Formulário
- **ExpenseForm** - Formulário de criação/edição de despesas

---

## 🔐 Autenticação

O projeto usa **NextAuth.js** com estratégia JWT e Google OAuth Provider:

- **Adapter**: Prisma (persiste usuários no PostgreSQL)
- **Strategy**: JWT (melhor performance)
- **Provider**: Google OAuth 2.0
- **Session**: 30 dias de duração

### Callbacks customizados:
- Adiciona `userId` ao token JWT
- Expõe `userId` na sessão do cliente

---

## ✅ Validação de Dados

Validação customizada em JavaScript (alternativa ao Zod):

```javascript
// lib/validacoes.js
validarDespesa(dados)      // Valida estrutura da despesa
sanitizarDadosDespesa(dados) // Limpa e sanitiza dados
```

### Regras de validação:
- **title**: obrigatório, max 200 caracteres
- **amount**: obrigatório, número positivo
- **date**: obrigatória, data válida
- **category**: obrigatória
- **recurring**: booleano (opcional)
- **recurrenceType**: NONE | MONTHLY | YEARLY
- **notes**: opcional, max 1000 caracteres

---

## 🌐 Deploy

### Recomendações:
- **Frontend**: Vercel (otimizado para Next.js)
- **Backend**: Incluído no Next.js (API Routes)
- **Banco de dados**: Supabase PostgreSQL

### Variáveis de ambiente necessárias em produção:
```env
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

---

## 👤 Desenvolvido por

**Sarah Hernandes**

---

## 📄 Licença

Este projeto é privado e foi desenvolvido para fins educacionais.
- **Lint**: ESLint + Prettier

## 📦 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Google (para OAuth)
- PostgreSQL (opcional, SQLite funciona para desenvolvimento)

## 🔧 Instalação

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database (SQLite para dev)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="gere-um-secret-aqui"  # Use o comando abaixo para gerar
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (veja instruções abaixo)
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

Para gerar o `NEXTAUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Configure Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Navegue para **APIs & Services > Credentials**
4. Clique em **Create Credentials > OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copie o **Client ID** e **Client Secret** para o `.env`

### 4. Configure o banco de dados

Execute as migrations do Prisma:

```bash
npx prisma migrate dev --name init
```

Ou, se usar SQLite em desenvolvimento:

```bash
npx prisma db push
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📚 Scripts disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas de lint automaticamente
npm test             # Executa testes
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Gera relatório de cobertura
npm run prisma:migrate # Executa migrations
npm run prisma:studio  # Abre Prisma Studio (GUI do banco)
```

## 🏗️ Estrutura do Projeto

```
vittacash/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js      # Configuração NextAuth
│   │   ├── expenses/
│   │   │   ├── index.js              # GET/POST despesas
│   │   │   ├── [id].js               # GET/PUT/DELETE despesa
│   │   │   ├── report.js             # Relatórios
│   │   │   ├── export.js             # Exportar CSV
│   │   │   └── import.js             # Importar CSV
│   │   └── health.js                 # Health check
│   ├── expenses/
│   │   ├── index.jsx                 # Listagem
│   │   ├── new.jsx                   # Criar
│   │   └── [id].jsx                  # Editar
│   ├── reports/
│   │   └── index.jsx                 # Relatórios
│   ├── _app.js                       # App wrapper
│   └── index.jsx                     # Dashboard
├── src/app/
│   ├── components/
│   │   ├── authButton/
│   │   │   ├── AuthButton.jsx
│   │   │   └── AuthButton.module.css
│   │   └── expenseForm/
│   │       ├── ExpenseForm.jsx
│   │       └── ExpenseForm.module.css
│   └── globals.css
├── lib/
│   ├── prisma.js                     # Cliente Prisma
│   └── validacoes.js                 # Validações
├── services/
│   └── api.js                        # Cliente API (axios)
├── prisma/
│   └── schema.prisma                 # Schema do banco
├── __tests__/
│   ├── api/
│   │   └── expenses.test.js
│   └── components/
│       └── ExpenseForm.test.jsx
├── .env.example
├── jest.config.js
├── jest.setup.js
├── package.json
└── README.md
```

## 🔐 Segurança

### Práticas Implementadas

1. **Autenticação obrigatória**: Todas as rotas de API verificam sessão
2. **Verificação de propriedade**: Usuários só podem acessar suas próprias despesas
3. **Queries parametrizadas**: Prisma previne SQL injection automaticamente
4. **Validação server-side**: Todas as entradas são validadas no servidor
5. **Secrets não commitados**: `.env` está no `.gitignore`
6. **CSRF Protection**: NextAuth.js gerencia automaticamente
7. **No logging de secrets**: Tokens nunca são logados

### Variáveis de Ambiente Sensíveis

⚠️ **NUNCA** commite o arquivo `.env` para o Git!

## 🧪 Testes

### Executar testes

```bash
npm test
```

### Cobertura de testes

```bash
npm run test:coverage
```

### Estrutura de testes

- **API Tests**: `/api/expenses` (GET, POST)
- **Component Tests**: `ExpenseForm` (renderização, validação, submit)

## 📝 API Endpoints

### Autenticação

- `GET /api/auth/signin` - Página de login
- `GET /api/auth/signout` - Logout
- `GET /api/auth/session` - Obter sessão atual

### Despesas

- `GET /api/expenses?month=MM&year=YYYY` - Listar despesas
- `POST /api/expenses` - Criar despesa
- `GET /api/expenses/:id` - Obter despesa
- `PUT /api/expenses/:id` - Atualizar despesa
- `DELETE /api/expenses/:id` - Deletar despesa

### Relatórios

- `GET /api/expenses/report?type=monthly&year=2025&month=11` - Relatório mensal
- `GET /api/expenses/report?type=yearly&year=2025` - Relatório anual

### Import/Export

- `GET /api/expenses/export?month=MM&year=YYYY` - Exportar CSV
- `POST /api/expenses/import` - Importar CSV

## 🎨 ESLint e Prettier

### Configuração Recomendada

Instale as dependências:

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier prettier
```

### Arquivo `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## 🐛 Troubleshooting

### Erro: "Prisma Client is not generated"

```bash
npx prisma generate
```

### Erro de autenticação Google

1. Verifique se as URLs de redirect estão corretas no Google Console
2. Confirme que `NEXTAUTH_URL` está correto no `.env`
3. Certifique-se de que `NEXTAUTH_SECRET` está definido


**VittaCash** - Controle seus gastos com inteligência 💰
