# 🔍 Diagnóstico: Imagem do Usuário não Aparece

## Problema
A imagem do perfil do Google não aparece no frontend após o login.

## Causa Raiz
O backend está retornando os dados do usuário, mas provavelmente a imagem não está sendo salva corretamente no `localStorage` ou não está vindo do Google OAuth.

## Verificações Necessárias

### 1. Verificar o que está no localStorage
Abra o DevTools (F12) → Console e digite:
```javascript
console.log(JSON.parse(localStorage.getItem('vittacash_user')));
```

**Resultado esperado:**
```json
{
  "id": "...",
  "name": "Nome do Usuário",
  "email": "email@gmail.com",
  "image": "https://lh3.googleusercontent.com/..." // ← Deve ter esta URL
}
```

### 2. Se `image` está `null` ou não existe

O problema pode estar em um destes locais:

#### A) Backend - AuthService não está pegando a foto do Google
Verifique se no backend o `AuthService` está extraindo corretamente a foto do token do Google:

```javascript
// Backend: src/services/AuthService.js
async fazerLoginGoogle(tokenGoogle) {
  const ticket = await client.verifyIdToken({
    idToken: tokenGoogle,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  console.log('📸 Dados do Google:', payload); // DEBUG

  // Deve usar 'picture' do payload do Google
  const dadosUsuario = {
    email: payload.email,
    name: payload.name,
    image: payload.picture, // ← IMPORTANTE: deve ser 'picture' não 'image'
    emailVerified: payload.email_verified ? new Date() : null,
  };

  // ... resto do código
}
```

#### B) Backend - UserRepository não está retornando `image`
O seu `UserRepository.criar()` e `buscarPorEmail()` precisam incluir `image`:

```javascript
// Já está correto no código que você enviou ✅
select: {
  id: true,
  name: true,
  email: true,
  image: true, // ✅
  createdAt: true,
}
```

#### C) Backend - Response não está incluindo `image`
No controller de login, verifique se está retornando `image`:

```javascript
// Backend: src/controllers/AuthController.js
async loginGoogle(req, res) {
  const { tokenGoogle } = req.body;
  const resultado = await authService.fazerLoginGoogle(tokenGoogle);
  
  console.log('👤 Usuário retornado:', resultado.usuario); // DEBUG
  
  res.json({
    token: resultado.token,
    usuario: {
      id: resultado.usuario.id,
      name: resultado.usuario.name,
      email: resultado.usuario.email,
      image: resultado.usuario.image, // ← Deve estar aqui
    }
  });
}
```

## Solução Rápida - Forçar Atualização do Usuário

Se o usuário já existe no banco SEM imagem, você pode:

### Opção 1: Atualizar manualmente no banco de dados
Execute no Supabase SQL Editor:
```sql
UPDATE users 
SET image = 'URL_DA_FOTO_AQUI'
WHERE email = 'seu_email@gmail.com';
```

### Opção 2: Fazer logout e login novamente
1. Limpe o localStorage: `localStorage.clear()`
2. Faça login novamente pelo Google
3. O backend deve criar/atualizar com a foto correta

### Opção 3: Backend buscar foto automaticamente ao fazer login
Adicione esta lógica no backend:

```javascript
// Backend: AuthService.js - na função fazerLoginGoogle
let usuario = await userRepository.buscarPorEmail(payload.email);

if (usuario) {
  // Se usuário existe mas não tem imagem, atualiza
  if (!usuario.image && payload.picture) {
    usuario = await userRepository.atualizar(usuario.id, {
      image: payload.picture,
      name: payload.name, // Atualiza nome também
    });
  }
} else {
  // Cria novo usuário com imagem
  usuario = await userRepository.criar({
    email: payload.email,
    name: payload.name,
    image: payload.picture, // ← picture do Google
    emailVerified: payload.email_verified ? new Date() : null,
  });
}
```

## Debug no Frontend

Adicione logs temporários no `ProfileButton.jsx`:

```javascript
useEffect(() => {
  const verificarAuth = () => {
    const isAuth = authService.isAuthenticated();
    setAutenticado(isAuth);
    if (isAuth) {
      const user = authService.getUser();
      console.log('👤 Dados do usuário no frontend:', user);
      console.log('📸 URL da imagem:', user?.image);
      setUsuario(user);
    }
  };
  verificarAuth();
}, []);
```

## Checklist de Verificação

- [ ] `localStorage` contém `vittacash_user` com campo `image`?
- [ ] URL da imagem é válida (começa com `https://`)?
- [ ] Backend está extraindo `picture` do payload do Google?
- [ ] Backend está salvando `image` no banco de dados?
- [ ] Response do `/auth/login/google` inclui `image`?
- [ ] Frontend está salvando corretamente no localStorage?

## Teste Final

Após ajustes, teste:
1. Limpar localStorage: `localStorage.clear()`
2. Fazer login novamente
3. Verificar no console: `localStorage.getItem('vittacash_user')`
4. Deve ver a URL da imagem do Google
5. Imagem deve aparecer no botão de perfil
