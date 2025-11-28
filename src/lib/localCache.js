/**
 * Sistema de Cache Persistente com LocalStorage
 * Complementa o cache em memória com persistência entre sessões
 */

const CACHE_PREFIX = 'vittacash_cache_';
const CACHE_VERSION = 'v1';

class LocalStorageCache {
  constructor() {
    this.limparCacheAntigo();
  }

  /**
   * Gera chave completa com prefixo e versão
   */
  gerarChave(chave) {
    return `${CACHE_PREFIX}${CACHE_VERSION}_${chave}`;
  }

  /**
   * Salva no localStorage com timestamp de expiração
   */
  set(chave, dados, ttlMinutos = 10) {
    if (globalThis.window === undefined) return;

    try {
      const item = {
        dados,
        timestamp: Date.now(),
        expiraEm: Date.now() + (ttlMinutos * 60 * 1000),
      };

      localStorage.setItem(
        this.gerarChave(chave),
        JSON.stringify(item)
      );
    } catch (error_) {
      // LocalStorage cheio ou desabilitado
      console.warn('Erro ao salvar no localStorage:', error_);
    }
  }

  /**
   * Recupera do localStorage se ainda válido
   */
  get(chave) {
    if (globalThis.window === undefined) return null;

    try {
      const itemString = localStorage.getItem(this.gerarChave(chave));
      if (!itemString) return null;

      const item = JSON.parse(itemString);

      // Verifica se expirou
      if (Date.now() > item.expiraEm) {
        localStorage.removeItem(this.gerarChave(chave));
        return null;
      }

      return item.dados;
    } catch (error_) {
      console.warn('Erro ao ler do localStorage:', error_);
      return null;
    }
  }

  /**
   * Remove item específico
   */
  remover(chave) {
    if (globalThis.window === undefined) return;
    localStorage.removeItem(this.gerarChave(chave));
  }

  /**
   * Remove todos os itens que começam com o prefixo
   */
  removerPorPrefixo(prefixo) {
    if (globalThis.window === undefined) return;

    const chaveCompleta = this.gerarChave(prefixo);
    const chaves = Object.keys(localStorage);

    for (const chave of chaves) {
      if (chave.startsWith(chaveCompleta)) {
        localStorage.removeItem(chave);
      }
    }
  }

  /**
   * Limpa todo o cache do localStorage
   */
  limpar() {
    if (globalThis.window === undefined) return;

    const chaves = Object.keys(localStorage);
    for (const chave of chaves) {
      if (chave.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(chave);
      }
    }
  }

  /**
   * Remove caches de versões antigas
   */
  limparCacheAntigo() {
    if (globalThis.window === undefined) return;

    const chaves = Object.keys(localStorage);
    for (const chave of chaves) {
      if (chave.startsWith(CACHE_PREFIX) && !chave.includes(CACHE_VERSION)) {
        localStorage.removeItem(chave);
      }
    }
  }

  /**
   * Remove itens expirados
   */
  limparExpirados() {
    if (globalThis.window === undefined) return;

    const agora = Date.now();
    const chaves = Object.keys(localStorage);

    for (const chave of chaves) {
      if (chave.startsWith(CACHE_PREFIX)) {
        try {
          const itemString = localStorage.getItem(chave);
          if (itemString) {
            const item = JSON.parse(itemString);
            if (agora > item.expiraEm) {
              localStorage.removeItem(chave);
            }
          }
        } catch (error_) {
          // Item corrompido, remove
          console.warn('Item de cache corrompido, removendo:', error_);
          localStorage.removeItem(chave);
        }
      }
    }
  }

  /**
   * Retorna informações sobre o cache
   */
  getEstatisticas() {
    if (globalThis.window === undefined) return { total: 0, validos: 0, expirados: 0 };

    const chaves = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    const agora = Date.now();
    let validos = 0;
    let expirados = 0;

    for (const chave of chaves) {
      try {
        const itemString = localStorage.getItem(chave);
        if (itemString) {
          const item = JSON.parse(itemString);
          if (agora > item.expiraEm) {
            expirados++;
          } else {
            validos++;
          }
        }
      } catch (error_) {
        console.warn('Erro ao processar estatísticas:', error_);
        expirados++;
      }
    }

    return {
      total: chaves.length,
      validos,
      expirados,
    };
  }
}

// Instância singleton
const localCache = new LocalStorageCache();

// Limpa expirados ao iniciar e a cada 5 minutos
if (globalThis.window !== undefined) {
  localCache.limparExpirados();
  setInterval(() => {
    localCache.limparExpirados();
  }, 5 * 60 * 1000);
}

export default localCache;

/**
 * Hook para usar cache persistente no React
 */
export const useLocalCache = () => {
  return {
    set: localCache.set.bind(localCache),
    get: localCache.get.bind(localCache),
    remover: localCache.remover.bind(localCache),
    removerPorPrefixo: localCache.removerPorPrefixo.bind(localCache),
    limpar: localCache.limpar.bind(localCache),
    getEstatisticas: localCache.getEstatisticas.bind(localCache),
  };
};
