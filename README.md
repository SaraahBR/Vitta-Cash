# VittaCash 💰

<p align="center">
  <img src="public/LOGO_VittaCash.png" alt="VittaCash Logo" width="400"/>
</p>

<p align="center">
  <strong>Sistema completo de Controle de Gastos Pessoais com Dashboard interativo, gráficos de análise e relatórios detalhados</strong>
</p>

<p align="center">
  Desenvolvido com Next.js 16, React, NextAuth.js, Prisma, PostgreSQL e Recharts
</p>

---

## ✨ Características Principais

### 🔐 Autenticação e Segurança
- ✅ Autenticação via Google OAuth (NextAuth.js)
- ✅ Autenticação via Email e Senha
- ✅ Verificação de email obrigatória
- ✅ Sistema de reenvio de email de verificação
- ✅ Proteção de rotas autenticadas
- ✅ Gerenciamento seguro de sessões com JWT

### 💵 Gestão de Despesas
- ✅ CRUD completo de despesas (Criar, Ler, Atualizar, Deletar)
- ✅ Categorização customizável (Alimentação, Transporte, Moradia, etc.)
- ✅ Despesas recorrentes (mensal/anual)
- ✅ Filtros avançados por mês, ano, categoria e período
- ✅ Notas e descrições detalhadas
- ✅ Validação de dados em tempo real

### 📊 Dashboard e Visualização
- ✅ Dashboard interativo com resumo financeiro
- ✅ Gráfico de Pizza: despesas por categoria (mensal)
- ✅ Gráfico de Barras: evolução de gastos ao longo do ano
- ✅ Cards informativos com totais do mês e ano
- ✅ Indicadores de média de gastos mensais
- ✅ Visualização responsiva para desktop e mobile

### 📈 Relatórios e Análises
- ✅ Relatórios mensais detalhados
- ✅ Relatórios anuais consolidados
- ✅ Exportação de dados em CSV
- ✅ Importação de despesas via CSV
- ✅ Análise de gastos por categoria
- ✅ Análise de evolução temporal

### 🎨 Interface e Experiência
- ✅ Design moderno com gradiente verde/amarelo
- ✅ Interface 100% responsiva (mobile-first)
- ✅ Animações e transições suaves
- ✅ Menu hamburguer para navegação mobile
- ✅ Feedback visual em todas as ações
- ✅ Loading states e tratamento de erros

### 🧪 Qualidade de Código
- ✅ Testes automatizados com Jest
- ✅ Validação server-side e client-side
- ✅ ESLint + Prettier para código limpo
- ✅ TypeScript-ready com jsconfig.json
- ✅ Componentização modular
- ✅ Banco de dados com Prisma ORM (PostgreSQL)

---

## 🚀 Tecnologias

### Frontend
- **Next.js 15.1.3** (App Router - Nova arquitetura)
- **React 19.0.0** com React Compiler otimizado
- **Recharts 2.15.0** para gráficos interativos
- **CSS Modules** para estilização componentizada
- **Axios 1.7.9** para requisições HTTP

### Backend/API
- **Next.js API Routes** (Route Handlers modernos)
- **NextAuth.js 4.24.11** para autenticação OAuth e credenciais
- **Prisma 5.7.1** como ORM
- **PostgreSQL** (Supabase Cloud)
- **Bcrypt 5.1.1** para criptografia de senhas

### Desenvolvimento e Testes
- **ESLint 9** + **Prettier** para código limpo
- **Jest 29.7.0** + **React Testing Library 16** para testes
- **Formidable 3.5.2** para upload de arquivos CSV
- **jsconfig.json** para intellisense e imports absolutos

---

## 📁 Estrutura do Projeto

```
vittacash/
├── src/
│   ├── app/                                    # App Router (Next.js 15)
│   │   ├── api/                                # API Routes (Backend)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.js                # Configuração NextAuth (Google + Credenciais)
│   │   │   ├── expenses/
│   │   │   │   ├── route.js                    # GET (listar) e POST (criar)
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js                # GET, PUT, DELETE (individual)
│   │   │   │   ├── export/
│   │   │   │   │   └── route.js                # Exportar CSV
│   │   │   │   ├── import/
│   │   │   │   │   └── route.js                # Importar CSV (multipart)
│   │   │   │   └── report/
│   │   │   │       └── route.js                # Relatórios mensais/anuais
│   │   │   └── health/
│   │   │       └── route.js                    # Health check
│   │   │
│   │   ├── auth/                               # Páginas de autenticação
│   │   │   ├── login/
│   │   │   │   ├── page.js                     # Página de login
│   │   │   │   └── login.css                   # Estilos do login
│   │   │   ├── cadastro/
│   │   │   │   ├── page.js                     # Página de cadastro
│   │   │   │   └── cadastro.css                # Estilos do cadastro
│   │   │   ├── verificar-email/
│   │   │   │   ├── page.js                     # Página de verificação
│   │   │   │   └── verificar-email.css         # Estilos da verificação
│   │   │   └── reenviar-verificacao/
│   │   │       ├── page.js                     # Página de reenvio
│   │   │       └── reenviar-verificacao.css    # Estilos do reenvio
│   │   │
│   │   ├── components/                         # Componentes React
│   │   │   ├── authButton/
│   │   │   │   ├── AuthButton.jsx              # Botão de autenticação
│   │   │   │   └── authButton.css              # Estilos do botão
│   │   │   ├── authModal/
│   │   │   │   ├── AuthModal.jsx               # Modal de autenticação
│   │   │   │   └── authModal.css               # Estilos do modal
│   │   │   ├── authProvider/
│   │   │   │   └── AuthProvider.jsx            # Provider de contexto
│   │   │   ├── charts/
│   │   │   │   └── ReportsCharts.jsx           # 📊 Gráficos Recharts (Novo!)
│   │   │   ├── expenseForm/
│   │   │   │   ├── ExpenseForm.jsx             # Formulário de despesas
│   │   │   │   └── expenseForm.css             # Estilos do formulário
│   │   │   ├── footer/
│   │   │   │   ├── Footer.jsx                  # Rodapé
│   │   │   │   └── footer.css                  # Estilos do rodapé
│   │   │   ├── header/
│   │   │   │   ├── Header.jsx                  # Cabeçalho
│   │   │   │   └── header.css                  # Estilos do cabeçalho
│   │   │   ├── hero/
│   │   │   │   ├── Hero.jsx                    # Hero section
│   │   │   │   └── hero.css                    # Estilos do hero
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx                  # Layout wrapper
│   │   │   │   └── layout.css                  # Estilos do layout
│   │   │   ├── loading/
│   │   │   │   ├── LoadingScreen.jsx           # Tela de carregamento
│   │   │   │   └── loadingScreen.css           # Estilos do loading
│   │   │   ├── loginButton/
│   │   │   │   ├── LoginButton.jsx             # Botão de login
│   │   │   │   └── loginButton.css             # Estilos do botão
│   │   │   ├── navbar/
│   │   │   │   ├── Navbar.jsx                  # Barra de navegação
│   │   │   │   └── navbar.css                  # Estilos da navbar
│   │   │   ├── profileButton/
│   │   │   │   ├── ProfileButton.jsx           # Botão de perfil
│   │   │   │   └── profileButton.css           # Estilos do botão
│   │   │   └── sessionProvider/
│   │   │       └── SessionProvider.jsx         # Provider de sessão
│   │   │
│   │   ├── expenses/                           # Páginas de despesas
│   │   │   ├── page.js                         # Lista de despesas
│   │   │   ├── expenses.css                    # Estilos da lista
│   │   │   ├── new/
│   │   │   │   ├── page.js                     # Nova despesa
│   │   │   │   └── new.css                     # Estilos da criação
│   │   │   └── [id]/
│   │   │       ├── page.js                     # Editar despesa
│   │   │       └── edit.css                    # Estilos da edição
│   │   │
│   │   ├── reports/
│   │   │   ├── page.js                         # Página de relatórios
│   │   │   └── reports.css                     # Estilos dos relatórios
│   │   │
│   │   ├── layout.js                           # Layout raiz da aplicação
│   │   ├── page.js                             # 🏠 Dashboard principal (Com gráficos!)
│   │   ├── page.css                            # Estilos do dashboard
│   │   └── globals.css                         # Estilos globais + variáveis CSS
│   │
│   ├── lib/
│   │   ├── prisma.js                           # Cliente Prisma singleton
│   │   └── validacoes.js                       # Funções de validação customizadas
│   │
│   ├── prisma/
│   │   └── schema.prisma                       # Schema do banco de dados
│   │
│   └── services/
│       └── api.js                              # Serviços de API (Axios)
│   └── services/
│       └── api.js                              # Serviços de API (Axios)
│
├── __tests__/                                  # Testes automatizados
│   ├── api/
│   │   └── expenses.test.js                    # Testes de API
│   └── components/
│       └── ExpenseForm.test.jsx                # Testes de componentes
│
├── public/                                     # Arquivos estáticos
│   └── LOGO_VittaCash.png                      # Logo da aplicação
│
├── .env                                        # Variáveis de ambiente (não commitar!)
├── .env.example                                # Exemplo de variáveis
├── .gitignore                                  # Arquivos ignorados
├── eslint.config.mjs                           # Configuração ESLint
├── jest.config.js                              # Configuração Jest
├── jest.setup.js                               # Setup dos testes
├── jsconfig.json                               # Configuração JavaScript
├── next.config.mjs                             # Configuração Next.js
├── package.json                                # Dependências e scripts
├── LICENSE                                     # Licença do projeto
└── README.md                                   # Este arquivo
```

---

## 🎨 Design e Identidade Visual

### Paleta de Cores
- **Verde Principal**: `#34d399` - Cor primária da marca
- **Amarelo Secundário**: `#fbbf24` - Cor secundária para gradientes
- **Verde Escuro**: `#1D361F` - Footer e elementos de contraste
- **Vermelho Suave**: `#f87171` - Botão de exclusão
- **Off-White**: `#f8f9fa` - Botões neutros

### Gradientes
- **Primário**: `linear-gradient(135deg, #34d399, #fbbf24)`
- **Footer**: `linear-gradient(135deg, #1D361F 0%, #2d4a2f 100%)`
- **Botões**: Gradientes suaves para ações principais

### Responsividade
- **Breakpoint Mobile**: 768px
- **Design Mobile-First**: Otimizado para dispositivos móveis
- **Grid Responsivo**: Cards e gráficos se adaptam ao tamanho da tela
- **Menu Hamburguer**: Navegação otimizada para mobile
- **Gráficos Adaptativos**: Dimensões e fontes ajustadas para mobile

---

## 🔌 API Routes

### 🔐 Autenticação
- `POST /api/auth/signin` - Login com Google OAuth ou Credenciais
- `POST /api/auth/signup` - Criar conta com email/senha
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Obter sessão atual
- `POST /api/auth/verify-email` - Verificar email
- `POST /api/auth/resend-verification` - Reenviar email de verificação

> 📧 **Sistema de E-mails:** O backend usa **Brevo** (ex-Sendinblue) para envio de e-mails de verificação.  
> Para mais detalhes sobre o fluxo de e-mails, troubleshooting e testes, consulte: [`docs/EMAIL_SYSTEM.md`](docs/EMAIL_SYSTEM.md)

### 💵 Despesas (CRUD)
- `GET /api/expenses` - Listar despesas do usuário
  - Query params: `month`, `year`, `from`, `to`, `category`
  - Exemplo: `/api/expenses?month=11&year=2025&category=Alimentação`
- `POST /api/expenses` - Criar nova despesa
  - Body: `{ title, amount, date, category, recurring, recurrenceType, notes }`
- `GET /api/expenses/:id` - Buscar despesa específica por ID
- `PUT /api/expenses/:id` - Atualizar despesa existente
- `DELETE /api/expenses/:id` - Excluir despesa

### 📊 Relatórios e Análises
- `GET /api/expenses/report?type=monthly&year=2025&month=11` - Relatório mensal
  - Retorna: total mensal, média diária, gastos por categoria, por dia
- `GET /api/expenses/report?type=yearly&year=2025` - Relatório anual
  - Retorna: total anual, média mensal, gastos por categoria, por mês

### 📥📤 Import/Export
- `GET /api/expenses/export?month=11&year=2025` - Exportar despesas em CSV
  - Formato: Data, Título, Valor, Categoria, Recorrente, Tipo, Notas
- `POST /api/expenses/import` - Importar despesas via CSV
  - Content-Type: `multipart/form-data`
  - Campo: `file` (arquivo CSV)

### 🏥 Utilidades
- `GET /api/health` - Health check da aplicação
  - Retorna: status da API, timestamp, versão

---

## 🗄️ Modelo de Dados (Prisma)

### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?   // Hash bcrypt (para autenticação por credenciais)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  expenses      Expense[]
  
  @@index([email])
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

### Account (NextAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### Session (NextAuth)
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### VerificationToken (NextAuth)
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## ⚙️ Setup Local

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL (ou conta no Supabase)
- Conta Google Cloud (para OAuth)

### 1. Clonar o Repositório
```bash
git clone https://github.com/SaraahBR/Vitta-Cash.git
cd vittacash
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados PostgreSQL (Supabase)
DATABASE_URL="postgresql://usuario:senha@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@host:5432/database?sslmode=require"

# NextAuth (gere secret com: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui-use-openssl-rand"

# Google OAuth (obter em: https://console.cloud.google.com)
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# API (opcional para dev)
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

#### Como obter Google OAuth Credentials:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Navegue para **APIs & Services > Credentials**
4. Clique em **Create Credentials > OAuth 2.0 Client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copie Client ID e Client Secret para o `.env`

### 4. Configurar Banco de Dados

Sincronizar schema Prisma com PostgreSQL:

```bash
npm run prisma:push
```

Ou criar migrations (recomendado para produção):

```bash
npm run prisma:migrate
```

Abrir Prisma Studio para visualizar dados:

```bash
npm run prisma:studio
```

### 5. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

Abrir navegador em: **http://localhost:3000**

### 6. Primeiro Acesso
1. Clique em "Entrar"
2. Escolha entre:
   - Login com Google (OAuth)
   - Criar conta com email/senha
3. Se usar email/senha, verifique seu email
4. Após login, será redirecionado para o Dashboard

---

## 🧪 Testes

### Executar Testes

```bash
# Rodar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Cobertura de código
npm run test:coverage
```

### Cobertura Atual

- **API Routes**: Testes de GET e POST para expenses
- **Componentes**: Testes do ExpenseForm (renderização, validação, submit)
- **Mocks**: NextAuth e Axios mockados para isolamento

### Tecnologias de Teste

- **Jest 29.7.0** - Framework de testes
- **React Testing Library 16** - Testes de componentes React
- **@testing-library/jest-dom** - Matchers customizados
- **jest-environment-jsdom** - Ambiente DOM para React

---

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento na porta 3000 |
| `npm run build` | Gera build otimizado para produção |
| `npm start` | Inicia servidor de produção (após build) |
| `npm run lint` | Verifica código com ESLint |
| `npm run lint:fix` | Corrige problemas de lint automaticamente |
| `npm test` | Executa todos os testes com Jest |
| `npm run test:watch` | Executa testes em modo watch (desenvolvimento) |
| `npm run test:coverage` | Gera relatório de cobertura de testes |
| `npm run prisma:migrate` | Cria e aplica nova migration do Prisma |
| `npm run prisma:studio` | Abre Prisma Studio (GUI do banco de dados) |
| `npm run prisma:generate` | Gera Prisma Client atualizado |
| `npm run prisma:push` | Sincroniza schema com banco sem criar migration |

---

## 🧩 Componentes Principais

### 🎨 Componentes de UI
- **Header** - Cabeçalho com título e descrição
- **Hero** - Seção hero da landing page com CTA
- **Footer** - Rodapé com gradiente verde escuro
- **Navbar** - Barra de navegação responsiva com menu hamburguer
- **Layout** - Layout wrapper global com providers
- **LoadingScreen** - Tela de carregamento animada

### 🔐 Componentes de Autenticação
- **AuthButton** - Botão de autenticação inteligente (login/logout)
- **AuthModal** - Modal de escolha entre Google e Email/Senha
- **LoginButton** - Botão específico de login
- **ProfileButton** - Botão de perfil do usuário
- **SessionProvider** - Provider de sessão NextAuth
- **AuthProvider** - Provider de contexto de autenticação customizado

### 💵 Componentes de Despesas
- **ExpenseForm** - Formulário completo de criação/edição de despesas
  - Validação em tempo real
  - Suporte a recorrência
  - Campo de notas opcional
  - Categorias predefinidas

### 📊 Componentes de Visualização (Novo!)
- **ReportsCharts** - Container de gráficos Recharts
  - **PieChartCategories** - Gráfico de pizza para categorias
    - Cores customizadas por categoria
    - Tooltip com valores formatados
    - Responsivo (mobile/desktop)
  - **BarChartMonths** - Gráfico de barras mensal
    - Evolução de gastos ao longo do ano
    - Eixos formatados em reais (R$)
    - Grid suave e legenda inferior
    - Otimizado para mobile (fontes pequenas, barras finas)

---

## 🔐 Autenticação

O projeto usa **NextAuth.js** com múltiplas estratégias de autenticação:

### Providers Suportados
1. **Google OAuth 2.0** - Login com conta Google
2. **Credentials** - Login com email e senha

### Configuração
- **Adapter**: Prisma (persiste usuários no PostgreSQL)
- **Strategy**: JWT (melhor performance, stateless)
- **Session**: 30 dias de duração
- **Criptografia**: Bcrypt para senhas (10 rounds)
- **Email Verification**: Sistema de verificação obrigatória

### Features de Segurança
- ✅ Hash de senhas com bcrypt
- ✅ Tokens JWT assinados
- ✅ Verificação de email obrigatória
- ✅ Sistema de reenvio de verificação
- ✅ Proteção contra SQL injection (Prisma)
- ✅ Validação de dados server-side
- ✅ CSRF protection automática (NextAuth)

### Callbacks Customizados
- Adiciona `userId` ao token JWT
- Expõe `userId` e `emailVerified` na sessão
- Previne login sem verificação de email

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

### Plataformas Recomendadas

#### Opção 1: Vercel (Recomendado)
- **Frontend + Backend**: Deploy automático do Next.js
- **Banco de dados**: Supabase PostgreSQL
- **Vantagens**: 
  - Deploy automático via Git
  - Edge Functions
  - Preview deployments
  - Zero config

#### Opção 2: Railway
- **Full-stack**: Next.js + PostgreSQL integrado
- **Vantagens**: 
  - Banco de dados incluído
  - Simples configuração

#### Opção 3: Netlify
- **Frontend**: Next.js
- **Banco de dados**: Supabase externo

### Configuração do Deploy

#### 1. Preparar Aplicação
```bash
npm run build
npm start
```

#### 2. Variáveis de Ambiente em Produção
Configure estas variáveis no painel do Vercel/Railway:

```env
# Database (Supabase)
DATABASE_URL="postgresql://user:password@host.supabase.co:5432/postgres"
DIRECT_URL="postgresql://user:password@host.supabase.co:5432/postgres"

# NextAuth (gere novo secret para produção!)
NEXTAUTH_URL="https://seu-dominio.vercel.app"
NEXTAUTH_SECRET="secret-diferente-do-dev-mais-seguro"

# Google OAuth (crie credenciais de produção)
GOOGLE_CLIENT_ID="seu-client-id-producao.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-secret-producao"

# API
NEXT_PUBLIC_API_URL="https://seu-dominio.vercel.app/api"
```

#### 3. Configurar Google OAuth para Produção
1. No Google Cloud Console, adicione URLs de produção:
   - **Authorized JavaScript origins**: `https://seu-dominio.vercel.app`
   - **Authorized redirect URIs**: `https://seu-dominio.vercel.app/api/auth/callback/google`

#### 4. Aplicar Migrations no Banco de Produção
```bash
# Localmente, apontando para produção
DATABASE_URL="sua-url-producao" npm run prisma:migrate
```

### Checklist de Deploy
- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Google OAuth com URLs de produção
- [ ] Migrations aplicadas no banco
- [ ] NEXTAUTH_SECRET diferente do dev
- [ ] NEXTAUTH_URL aponta para produção

---

## � Funcionalidades Detalhadas

### Dashboard Principal
- **Cards Informativos**:
  - Total de gastos do mês atual
  - Total de gastos do ano atual
  - Média de gastos mensais
- **Gráfico de Pizza (Categorias)**:
  - Visualização de despesas por categoria do mês
  - Cores personalizadas para cada categoria
  - Tooltip com valores em R$
  - Responsivo para mobile e desktop
- **Gráfico de Barras (Meses)**:
  - Evolução de gastos ao longo do ano
  - 12 barras representando cada mês
  - Eixo Y em formato de reais (R$)
  - Grid suave para melhor leitura
- **Lista de Despesas Recentes**:
  - Últimas despesas cadastradas
  - Filtro por mês e ano

### Página de Despesas
- **Listagem Completa**:
  - Todas as despesas do usuário
  - Filtros por mês, ano e categoria
  - Ordenação por data
  - Ações: Editar e Excluir
- **Criar Nova Despesa**:
  - Formulário completo com validação
  - Categorias predefinidas
  - Suporte a recorrência
  - Campo de notas opcional
- **Editar Despesa**:
  - Formulário pré-preenchido
  - Validação em tempo real
  - Atualização instantânea

### Página de Relatórios
- **Filtros Customizáveis**:
  - Por mês específico
  - Por ano completo
  - Por categoria
  - Por período (de/até)
- **Estatísticas**:
  - Total de gastos
  - Média de gastos
  - Maior e menor despesa
- **Exportação CSV**:
  - Download de relatórios
  - Formato compatível com Excel
  - Importação de volta para o sistema

### Autenticação
- **Login com Google**: Um clique para entrar
- **Login com Email/Senha**: 
  - Cadastro com verificação de email
  - Sistema de reenvio de email
  - Senha criptografada com bcrypt
- **Proteção de Rotas**: Apenas usuários autenticados acessam funcionalidades

---

## 🎯 Roadmap Futuro

### Em Consideração
- [ ] Múltiplas contas bancárias
- [ ] Orçamentos e metas
- [ ] Notificações de gastos
- [ ] Modo escuro
- [ ] Exportação em PDF
- [ ] Compartilhamento de despesas (grupos)
- [ ] App mobile (React Native)
- [ ] Integração com bancos (Open Banking)
- [ ] Machine Learning para predição de gastos
- [ ] Categorização automática com IA

---

## 🤝 Contribuindo

Este é um projeto educacional, mas contribuições são bem-vindas!

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature incrível'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use ESLint e Prettier
- Escreva testes para novas features
- Documente mudanças significativas
- Siga convenções de commits semânticos

---

## 👤 Desenvolvido por

**Sarah Hernandes**  
[GitHub](https://github.com/SaraahBR) | [LinkedIn](https://www.linkedin.com/in/sarahernandes)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- **Next.js Team** - Framework incrível
- **Vercel** - Plataforma de deploy
- **Prisma** - ORM fantástico
- **NextAuth.js** - Autenticação simplificada
- **Recharts** - Biblioteca de gráficos
- **Supabase** - PostgreSQL gerenciado
- **Comunidade Open Source** - Por todas as bibliotecas utilizadas

---

<p align="center">
  <strong>VittaCash</strong> - Controle seus gastos com inteligência 💰📊
</p>

<p align="center">
  Feito com ❤️ e ☕ por Sarah Hernandes
</p>

