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
    if (typeof window === 'undefined') return;

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
    } catch (erro) {
      // LocalStorage cheio ou desabilitado
      console.warn('Erro ao salvar no localStorage:', erro);
    }
  }

  /**
   * Recupera do localStorage se ainda válido
   */
  get(chave) {
    if (typeof window === 'undefined') return null;

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
    } catch (erro) {
      console.warn('Erro ao ler do localStorage:', erro);
      return null;
    }
  }

  /**
   * Remove item específico
   */
  remover(chave) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.gerarChave(chave));
  }

  /**
   * Remove todos os itens que começam com o prefixo
   */
  removerPorPrefixo(prefixo) {
    if (typeof window === 'undefined') return;

    const chaveCompleta = this.gerarChave(prefixo);
    const chaves = Object.keys(localStorage);

    chaves.forEach(chave => {
      if (chave.startsWith(chaveCompleta)) {
        localStorage.removeItem(chave);
      }
    });
  }

  /**
   * Limpa todo o cache
   */
  limpar() {
    if (typeof window === 'undefined') return;

    const chaves = Object.keys(localStorage);
    chaves.forEach(chave => {
      if (chave.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(chave);
      }
    });
  }

  /**
   * Remove caches de versões antigas
   */
  limparCacheAntigo() {
    if (typeof window === 'undefined') return;

    const chaves = Object.keys(localStorage);
    chaves.forEach(chave => {
      if (chave.startsWith(CACHE_PREFIX) && !chave.includes(CACHE_VERSION)) {
        localStorage.removeItem(chave);
      }
    });
  }

  /**
   * Remove itens expirados
   */
  limparExpirados() {
    if (typeof window === 'undefined') return;

    const agora = Date.now();
    const chaves = Object.keys(localStorage);

    chaves.forEach(chave => {
      if (chave.startsWith(CACHE_PREFIX)) {
        try {
          const itemString = localStorage.getItem(chave);
          if (itemString) {
            const item = JSON.parse(itemString);
            if (agora > item.expiraEm) {
              localStorage.removeItem(chave);
            }
          }
        } catch (erro) {
          // Item corrompido, remove
          localStorage.removeItem(chave);
        }
      }
    });
  }

  /**
   * Retorna informações sobre o cache
   */
  getEstatisticas() {
    if (typeof window === 'undefined') return { total: 0, validos: 0, expirados: 0 };

    const chaves = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    const agora = Date.now();
    let validos = 0;
    let expirados = 0;

    chaves.forEach(chave => {
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
      } catch (erro) {
        expirados++;
      }
    });

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
if (typeof window !== 'undefined') {
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
