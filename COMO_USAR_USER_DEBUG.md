# 🔍 Como Usar o UserDebug

## O que é?
Um componente visual que mostra todos os dados do usuário logado e ajuda a diagnosticar problemas com a imagem do perfil.

## Como usar:

### 1. Abra a aplicação
O componente já está adicionado no Layout e aparece automaticamente em **modo desenvolvimento**.

### 2. Encontre o botão 👤
Procure por um **botão laranja flutuante** com emoji 👤 no canto inferior direito da tela (logo acima do botão de cache 🔧, se estiver visível).

### 3. Clique para abrir o painel
Um painel será aberto mostrando:

#### 📋 Dados do LocalStorage
- JSON completo do usuário
- Botão para copiar os dados

#### 📸 Preview da Imagem
- Se a imagem existe: mostra preview + URL
- Se não existe: mostra aviso ⚠️

#### 🔍 Checklist Automático
- ✅ Campo "id" presente
- ✅ Campo "email" presente
- ✅ Campo "name" presente
- ⚠️ Campo "image" presente (este é o importante!)
- ✅ URL da imagem válida

#### 🔄 Botão "Limpar e Relogar"
- Limpa todo o localStorage
- Redireciona para fazer login novamente
- Use isso se precisar resetar os dados

## O que verificar:

### ✅ Se a imagem ESTÁ aparecendo:
```json
{
  "id": "algum-id",
  "email": "seu@email.com",
  "name": "Seu Nome",
  "image": "https://lh3.googleusercontent.com/..." // ← URL válida
}
```
Tudo OK! ✨

### ❌ Se a imagem NÃO está aparecendo:

#### Caso 1: Campo "image" não existe
```json
{
  "id": "algum-id",
  "email": "seu@email.com",
  "name": "Seu Nome"
  // image não existe aqui!
}
```
**Solução:** O backend não está retornando o campo `image`. Verifique o arquivo `DEBUG_IMAGEM.md`.

#### Caso 2: Campo "image" é null
```json
{
  "id": "algum-id",
  "email": "seu@email.com",
  "name": "Seu Nome",
  "image": null // ← null!
}
```
**Solução:** O backend está retornando `null`. Pode ser que:
- O Google OAuth não está configurado corretamente
- O usuário foi criado antes do campo `image` ser implementado
- Clique em "Limpar e Relogar" para fazer login novamente

#### Caso 3: URL da imagem inválida
```json
{
  "id": "algum-id",
  "email": "seu@email.com",
  "name": "Seu Nome",
  "image": "/uploads/foto.jpg" // ← URL relativa, não funciona!
}
```
**Solução:** A URL deve começar com `https://`. URLs do Google sempre começam com `https://lh3.googleusercontent.com/`.

## Fluxo de diagnóstico:

1. **Abra o UserDebug** (botão 👤)
2. **Verifique o checklist**
   - Se ⚠️ aparecer em "Campo image presente" → backend não está enviando
   - Se ❌ aparecer em "URL da imagem válida" → URL está incorreta
3. **Teste a URL**
   - Clique em "🔗 Abrir URL em nova aba"
   - Se der erro 404/403 → URL inválida
   - Se abrir a imagem → URL válida, problema é no frontend
4. **Tente relogar**
   - Clique em "🔄 Limpar e Relogar"
   - Faça login novamente pelo Google
   - Abra o UserDebug novamente e verifique se `image` apareceu

## Copiar dados para análise:

1. Clique em "📋 Copiar JSON"
2. Cole no console do backend ou envie para alguém analisar

## Em produção:

O componente UserDebug **não aparecerá em produção** automaticamente porque está configurado para aparecer apenas em `development`:

```javascript
{process.env.NODE_ENV === 'development' && <UserDebug />}
```

Se quiser forçar em produção (temporariamente), edite o `Layout.jsx` e remova a condição.

---

**Pronto para diagnosticar!** 🔍✨
