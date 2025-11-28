/**
 * Sistema de Cache para VittaCash
 * Implementa cache em memória com expiração automática
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos padrão
  }

  /**
   * Gera uma chave de cache baseada nos parâmetros
   */
  gerarChave(prefixo, params = {}) {
    const paramsString = JSON.stringify(params);
    return `${prefixo}:${paramsString}`;
  }

  /**
   * Salva dados no cache com tempo de expiração
   */
  set(chave, dados, ttl = this.defaultTTL) {
    const expiraEm = Date.now() + ttl;
    this.cache.set(chave, {
      dados,
      expiraEm,
    });
  }

  /**
   * Recupera dados do cache se ainda válidos
   */
  get(chave) {
    const item = this.cache.get(chave);
    
    if (!item) {
      return null;
    }

    // Verifica se expirou
    if (Date.now() > item.expiraEm) {
      this.cache.delete(chave);
      return null;
    }

    return item.dados;
  }

  /**
   * Remove item específico do cache
   */
  invalidar(chave) {
    this.cache.delete(chave);
  }

  /**
   * Remove todos os itens que começam com o prefixo
   */
  invalidarPorPrefixo(prefixo) {
    const chaves = Array.from(this.cache.keys());
    for (const chave of chaves) {
      if (chave.startsWith(prefixo)) {
        this.cache.delete(chave);
      }
    }
  }

  /**
   * Limpa todo o cache em memória
   */
  limpar() {
    this.cache.clear();
  }

  /**
   * Remove itens expirados automaticamente
   */
  limparExpirados() {
    const agora = Date.now();
    const chaves = Array.from(this.cache.keys());
    
    for (const chave of chaves) {
      const item = this.cache.get(chave);
      if (item && agora > item.expiraEm) {
        this.cache.delete(chave);
      }
    }
  }

  /**
   * Wrapper para buscar dados com cache automático
   */
  async buscarComCache(chave, funcaoBusca, ttl = this.defaultTTL) {
    // Tenta buscar do cache primeiro
    const dadosEmCache = this.get(chave);
    if (dadosEmCache !== null) {
      return dadosEmCache;
    }

    // Se não encontrou no cache, busca da fonte
    const dados = await funcaoBusca();
    
    // Salva no cache para próximas requisições
    this.set(chave, dados, ttl);
    
    return dados;
  }
}

// Instância singleton do cache
const cacheGlobal = new CacheManager();

// Limpa itens expirados a cada 2 minutos
if (globalThis.window !== undefined) {
  setInterval(() => {
    cacheGlobal.limparExpirados();
  }, 2 * 60 * 1000);
}

export default cacheGlobal;

// Tempos de expiração padrão para diferentes tipos de dados
export const TTL = {
  DESPESAS: 3 * 60 * 1000,      // 3 minutos
  RELATORIOS: 5 * 60 * 1000,    // 5 minutos
  USUARIO: 15 * 60 * 1000,      // 15 minutos
  CATEGORIAS: 30 * 60 * 1000,   // 30 minutos
};

/**
 * Hook customizado para React com cache
 */
export const useCache = () => {
  return {
    buscarComCache: cacheGlobal.buscarComCache.bind(cacheGlobal),
    invalidar: cacheGlobal.invalidar.bind(cacheGlobal),
    invalidarPorPrefixo: cacheGlobal.invalidarPorPrefixo.bind(cacheGlobal),
    limpar: cacheGlobal.limpar.bind(cacheGlobal),
    gerarChave: cacheGlobal.gerarChave.bind(cacheGlobal),
  };
};
