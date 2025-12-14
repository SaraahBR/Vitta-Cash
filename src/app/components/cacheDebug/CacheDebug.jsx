'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocalCache } from '../../lib/localCache';
import cacheGlobal from '../../lib/cache';
import CacheDebugPanel from './CacheDebugPanel';
import './cacheDebug.css';

/**
 * Componente de Debug do Sistema de Cache
 * Para usar: adicione <CacheDebug /> em qualquer página durante desenvolvimento
 */
export default function CacheDebug() {
  const [mostrar, setMostrar] = useState(false);
  const [stats, setStats] = useState({
    memoria: { total: 0 },
    localStorage: { total: 0, validos: 0, expirados: 0 },
  });
  const localCache = useLocalCache();

  const atualizarStats = useCallback(() => {
    const memoriaSize = cacheGlobal.cache ? cacheGlobal.cache.size : 0;
    const localStats = localCache.getEstatisticas();

    setStats({
      memoria: { total: memoriaSize },
      localStorage: localStats,
    });
  }, [localCache]);

  const limparTudo = () => {
    if (globalThis.confirm('Limpar todo o cache?')) {
      cacheGlobal.limpar();
      localCache.limpar();
      atualizarStats();
      globalThis.alert('Cache limpo com sucesso!');
    }
  };

  const limparExpirados = () => {
    cacheGlobal.limparExpirados();
    localCache.limparExpirados();
    atualizarStats();
    globalThis.alert('Itens expirados removidos!');
  };

  useEffect(() => {
    if (mostrar) {
      const timer = setTimeout(() => atualizarStats(), 0);
      const interval = setInterval(atualizarStats, 2000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
    return undefined;
  }, [mostrar, atualizarStats]);

  return (
    <>
      <button
        onClick={() => setMostrar(!mostrar)}
        className="cache-debug-toggle"
        title="Debug do Cache"
      >
        🔧
      </button>

      {mostrar && (
        <CacheDebugPanel
          stats={stats}
          onClose={() => setMostrar(false)}
          onRefresh={atualizarStats}
          onClearExpired={limparExpirados}
          onClearAll={limparTudo}
        />
      )}
    </>
  );
}
