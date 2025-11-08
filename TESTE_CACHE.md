# 🚀 Guia Rápido - Sistema de Cache

## Como Testar

### 1. Veja o Cache em Ação

1. **Abra a aplicação** e vá para a página de Despesas
2. **Abra o Console do navegador** (F12 → Console)
3. **Observe as mensagens**:
   - `🌐 Buscando da API` - Primeira vez, busca do backend
   - `🚀 Cache memória` - Próximas vezes, instantâneo
   - `💾 Cache localStorage` - Após recarregar a página

### 2. Teste a Velocidade

**Sem Cache (antes):**
1. Acesse a página de despesas
2. Mude o filtro de mês → aguarde 2-3 segundos ⏳
3. Mude novamente → aguarde 2-3 segundos ⏳

**Com Cache (agora):**
1. Acesse a página de despesas
2. Mude o filtro de mês → aguarde 2-3 segundos (primeira vez)
3. Mude novamente → **INSTANTÂNEO** ⚡
4. Volte para o mês anterior → **INSTANTÂNEO** ⚡

### 3. Teste a Persistência

1. Acesse a página de despesas (aguarda carregar)
2. **Recarregue a página** (F5 ou Ctrl+R)
3. Observe no console: `💾 Cache localStorage`
4. Os dados aparecem **muito mais rápido**!

### 4. Use o Debug do Cache (Opcional)

Para visualizar o cache funcionando:

1. Abra `src/app/expenses/page.js`
2. Adicione no início:
   ```javascript
   import CacheDebug from '../components/cacheDebug/CacheDebug';
   ```
3. Adicione antes do `</Layout>`:
   ```jsx
   <CacheDebug />
   ```
4. Um botão 🔧 aparecerá no canto inferior direito
5. Clique para ver estatísticas do cache em tempo real

## ✅ Confirmando que Está Funcionando

### No Console do Navegador

Você deve ver mensagens como:
```
🌐 Buscando da API: despesas:{"mes":11,"ano":2025}
✅ Cache hit: despesas:{"mes":11,"ano":2025}
🚀 Cache memória: despesas:{"mes":11,"ano":2025}
```

### No LocalStorage

1. Abra DevTools (F12)
2. Vá em **Application** → **Local Storage**
3. Veja itens com prefixo `vittacash_cache_v1_`

## 🎯 Quando o Cache é Limpo

O cache é **automaticamente limpo** quando você:

- ✏️ **Criar** uma nova despesa
- 📝 **Editar** uma despesa existente
- 🗑️ **Excluir** uma despesa

Você pode verificar isso:
1. Crie uma despesa
2. Veja no console: cache foi invalidado
3. Liste as despesas novamente
4. Console mostra: `🌐 Buscando da API` (cache foi limpo, busca nova)

## 🧪 Teste Completo

Execute este teste:

1. **Página de Despesas**
   - Primeira carga: ~2-3s → `🌐 Buscando da API`
   - Mude filtro: ~2-3s → `🌐 Buscando da API`
   - Volte filtro anterior: < 10ms → `🚀 Cache memória`
   - Recarregue (F5): < 100ms → `💾 Cache localStorage`

2. **Dashboard**
   - Primeira carga: ~2-3s → `🌐 Buscando da API`
   - Navegue para Despesas e volte: < 10ms → `🚀 Cache memória`

3. **Criar/Editar Despesa**
   - Crie uma despesa → Console: "Cache invalidado"
   - Volte para lista → `🌐 Buscando da API` (dados atualizados)

## 💡 Dicas

- **Ctrl + Shift + R**: Recarrega limpando cache do navegador (não afeta nosso cache)
- **Navegação**: Use os links da aplicação para ver o cache funcionando
- **Filtros**: Teste diferentes combinações de mês/ano/categoria

## 🐛 Se algo não funcionar

1. Limpe o cache manualmente:
   - Abra o console
   - Digite: `localStorage.clear()`
   - Recarregue a página

2. Verifique se há erros no console

3. Confirme que não está em **janela anônima** (localStorage pode estar desabilitado)

---

**Pronto!** Agora sua aplicação está muito mais rápida! 🚀
