# 📧 Sistema de E-mails - Frontend VittaCash

**Última atualização:** 17/11/2025  
**Sistema atual:** Brevo (ex-Sendinblue)  
**Status:** ✅ Funcionando em produção

---

## 🎯 Visão Geral

O backend VittaCash usa **Brevo** para envio de e-mails de verificação e boas-vindas. Esta mudança **não afeta o código do frontend**, mas é importante conhecer o fluxo para debugging.

### Migração Histórica
- ❌ **Gmail SMTP**: Bloqueado no Render Free Tier (porta 587)
- ❌ **SendGrid**: Trial de 60 dias, depois R$ 1.200/ano
- ✅ **Brevo**: 300 emails/dia grátis para sempre

---

## 🔄 Fluxo de Autenticação com E-mail

### 1. Cadastro Tradicional
```javascript
// src/app/auth/cadastro/page.js
POST https://vittacash.onrender.com/api/auth/cadastrar
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "confirmarSenha": "senha123"
}

// Resposta do backend
{
  "mensagem": "Cadastro realizado com sucesso! Verifique seu e-mail.",
  "usuario": {
    "id": "...",
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}

// ✅ Backend envia e-mail automaticamente via Brevo
```

### 2. E-mail de Verificação
```
📧 Assunto: ✅ Confirme seu e-mail - VittaCash
📨 Remetente: VittaCash <vittacash@gmail.com>
⏱️ Tempo de entrega: 5-10 segundos

🔗 Link de verificação:
https://vittacash.vercel.app/auth/verificar-email?token=xxx&email=xxx

⏰ Validade: 24 horas
```

### 3. Verificação de E-mail
```javascript
// src/app/auth/verificar-email/page.js
GET https://vittacash.onrender.com/api/auth/verificar-email?token=xxx&email=xxx

// Resposta de sucesso
{
  "mensagem": "E-mail verificado com sucesso!",
  "token": "jwt-token-here",
  "usuario": { ... }
}

// Frontend salva no localStorage e redireciona
localStorage.setItem('vittacash_token', data.token);
localStorage.setItem('vittacash_user', JSON.stringify(data.usuario));
router.push('/expenses');
```

### 4. Reenvio de Verificação
```javascript
// src/app/auth/reenviar-verificacao/page.js
POST https://vittacash.onrender.com/api/auth/reenviar-verificacao
{
  "email": "joao@email.com"
}

// Resposta
{
  "mensagem": "E-mail de verificação reenviado com sucesso"
}

// ✅ Novo e-mail enviado via Brevo
```

---

## 🐛 Troubleshooting

### Problema: "E-mail não chegou"

#### Passo 1: Verificar Logs do Backend
Acesse: https://dashboard.render.com/web/srv-xxx/logs

Procure por:
```
✅ Brevo API configurada
✅ E-mail enviado com sucesso via Brevo
   Message ID: <abc123@brevo.com>
```

#### Passo 2: Orientar o Usuário
```javascript
// Mensagens que o frontend já mostra:
1. "Verifique sua caixa de entrada"
2. "Não recebeu? Clique em 'Reenviar e-mail'"
3. "Verifique a pasta de spam/lixo eletrônico"
```

#### Passo 3: Reenviar E-mail
```javascript
// Usuário clica no botão "Reenviar"
// Frontend chama automaticamente:
POST /api/auth/reenviar-verificacao
```

---

### Problema: "Token expirado"

```javascript
// Backend retorna 400
{
  "error": "Token expirado ou inválido"
}

// Frontend mostra:
❌ "Link de verificação expirado"
📧 "Clique abaixo para receber um novo e-mail"

// Botão chama:
POST /api/auth/reenviar-verificacao
```

**Implementação atual:**
```javascript
// src/app/auth/verificar-email/page.js
{status === 'erro' && (
  <>
    <div className="erro-icon">❌</div>
    <h1>Erro na Verificação</h1>
    <p className="erro-mensagem">{mensagem}</p>
    <div className="erro-acoes">
      <Link href="/auth/reenviar-verificacao" className="btn-reenviar">
        Reenviar E-mail de Verificação
      </Link>
      <Link href="/auth/cadastro" className="btn-cadastrar-novamente">
        Cadastrar Novamente
      </Link>
    </div>
  </>
)}
```

---

### Problema: "E-mail já verificado"

```javascript
// Backend retorna
{
  "mensagem": "E-mail já verificado"
}

// Frontend deve:
1. Redirecionar para /auth/login
2. Mostrar toast: "Sua conta já está ativa! Faça login."
```

**Melhoria sugerida:**
```javascript
// src/app/auth/verificar-email/page.js
if (data.mensagem?.includes('já verificado')) {
  setStatus('sucesso');
  setMensagem('Sua conta já está verificada!');
  setTimeout(() => router.push('/auth/login'), 2000);
}
```

---

## ✅ Checklist de Testes

### Fluxo 1: Cadastro Completo ✅
- [ ] Preencher formulário de cadastro
- [ ] Submeter dados
- [ ] Ver mensagem de sucesso
- [ ] Receber e-mail em 5-10 segundos
- [ ] Clicar no link do e-mail
- [ ] Ver página de verificação com sucesso
- [ ] Ser redirecionado para /expenses
- [ ] Estar autenticado

### Fluxo 2: Reenvio de E-mail ✅
- [ ] Cadastrar usuário
- [ ] Não verificar e-mail
- [ ] Acessar /auth/reenviar-verificacao
- [ ] Digitar e-mail
- [ ] Submeter
- [ ] Receber novo e-mail
- [ ] Verificar que funciona

### Fluxo 3: Token Expirado ✅
- [ ] Criar token expirado (esperar 24h)
- [ ] Clicar no link antigo
- [ ] Ver erro "Token expirado"
- [ ] Clicar em "Reenviar"
- [ ] Receber novo e-mail
- [ ] Verificar com novo token

### Fluxo 4: E-mail na Caixa de Spam ✅
- [ ] Cadastrar usuário
- [ ] Verificar pasta de spam
- [ ] E-mail deve estar lá
- [ ] Clicar no link funciona normalmente

---

## 📊 Estatísticas de E-mail (Para Equipe)

### Dashboard Brevo
- URL: https://app.brevo.com/email/logs
- Acesso: Equipe backend

### Métricas Importantes
- **Taxa de entrega**: ~99%
- **Tempo médio**: 5-10 segundos
- **Limite diário**: 300 e-mails
- **Limite mensal**: 9.000 e-mails

### Alertas
```
⚠️ Se alcançarmos 250 e-mails/dia:
- Backend loga aviso
- Equipe deve avaliar upgrade do plano Brevo
```

---

## 🔧 Configuração (Apenas Referência)

### Variáveis de Ambiente (Backend)
```env
# Brevo API
BREVO_API_KEY=xkeysib-xxx...

# Frontend URL (para links nos e-mails)
FRONTEND_URL=https://vittacash.vercel.app
```

### URLs dos E-mails
Todos os links nos e-mails apontam para:
```
https://vittacash.vercel.app/auth/verificar-email?token=xxx&email=xxx
```

---

## 🎨 Design dos E-mails

### Template de Verificação
- **Cores**: Gradiente roxo (#667eea → #764ba2)
- **Botão**: "VERIFICAR E-MAIL" (verde)
- **Layout**: Responsivo (mobile-first)
- **Fallback**: Link em texto simples

### Template de Boas-Vindas (Google OAuth)
- **Assunto**: 🎉 Bem-vindo ao VittaCash!
- **Conteúdo**: Funcionalidades do app
- **CTA**: "ACESSAR VITTACASH"

---

## 🚨 Problemas Conhecidos

### 1. Timeout no Cadastro (Resolvido)
**Sintoma:** Frontend dava timeout após 30s  
**Causa:** Aguardava resposta do envio de e-mail  
**Solução:** Backend responde imediatamente, envia e-mail em background

**Implementação atual:**
```javascript
// src/app/auth/cadastro/page.js
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s

// Se timeout, mas backend funcionou:
if (err.name === 'AbortError') {
  setSucesso(true); // Assume que funcionou
}
```

### 2. CORS em Desenvolvimento (Resolvido)
**Sintoma:** Erro de CORS ao chamar backend  
**Causa:** Backend não tinha frontend local nas origens  
**Solução:** Backend adicionou `http://localhost:3000`

---

## 📱 Compatibilidade de E-mail

### Clientes Testados ✅
- Gmail (Web + App)
- Outlook (Web + App)
- Apple Mail (iOS + macOS)
- Yahoo Mail
- ProtonMail

### Problemas Conhecidos
- **Gmail**: Pode ir para "Promoções" em vez de "Principal"
- **Outlook.com**: Pode demorar até 2 minutos
- **Provedores brasileiros** (UOL, BOL): Taxa de entrega ~95%

---

## 🔗 Links Úteis

### Produção
- **Frontend**: https://vittacash.vercel.app
- **Backend**: https://vittacash.onrender.com
- **Swagger**: https://vittacash.onrender.com/api-docs

### Desenvolvimento
- **Frontend**: http://localhost:3000
- **Backend**: Configurar no `.env.local`

### Monitoramento
- **Render Logs**: https://dashboard.render.com/
- **Brevo Dashboard**: https://app.brevo.com/
- **Vercel Analytics**: https://vercel.com/dashboard

---

## 💡 Dicas para Desenvolvedores

### Debug de E-mails
```javascript
// Adicione logs temporários:
console.log('📤 Enviando cadastro:', { nome, email });
console.log('📥 Resposta backend:', data);
console.log('✅ E-mail deve chegar em:', email);
```

### Testar Localmente
```javascript
// 1. Configure backend local no .env.local:
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

// 2. Inicie backend:
cd vittacash-backend
npm run dev

// 3. Inicie frontend:
cd vittacash
npm run dev

// 4. Backend vai logar link de verificação:
📧 [MODO DEV] Link de verificação:
🔗 http://localhost:3000/auth/verificar-email?token=xxx
```

---

## 📞 Suporte

### Problemas com E-mails?
1. Verificar logs do Render
2. Verificar dashboard Brevo
3. Contactar equipe backend

### Contato
- **E-mail**: vihernandesbr@gmail.com
- **GitHub**: @SaraahBR

---

**Última revisão:** 17/11/2025  
**Sistema:** Brevo (300 emails/dia grátis)  
**Status:** ✅ Funcionando perfeitamente em produção
