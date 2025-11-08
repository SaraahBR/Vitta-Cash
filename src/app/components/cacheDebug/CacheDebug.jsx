'use client';

import { useState, useEffect } from 'react';
import { useLocalCache } from '../../lib/localCache';
import cacheGlobal from '../../lib/cache';
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

  const atualizarStats = () => {
    const memoriaSize = cacheGlobal.cache ? cacheGlobal.cache.size : 0;
    const localStats = localCache.getEstatisticas();

    setStats({
      memoria: { total: memoriaSize },
      localStorage: localStats,
    });
  };

  const limparTudo = () => {
    if (confirm('Limpar todo o cache?')) {
      cacheGlobal.limpar();
      localCache.limpar();
      atualizarStats();
      alert('Cache limpo com sucesso!');
    }
  };

  const limparExpirados = () => {
    cacheGlobal.limparExpirados();
    localCache.limparExpirados();
    atualizarStats();
    alert('Itens expirados removidos!');
  };

  useEffect(() => {
    if (mostrar) {
      atualizarStats();
      const interval = setInterval(atualizarStats, 2000);
      return () => clearInterval(interval);
    }
  }, [mostrar]);

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
        <div className="cache-debug-panel">
          <div className="cache-debug-header">
            <h3>📊 Cache Debug</h3>
            <button onClick={() => setMostrar(false)}>✕</button>
          </div>

          <div className="cache-debug-body">
            <div className="cache-debug-section">
              <h4>💾 Cache em Memória</h4>
              <p>Total de itens: <strong>{stats.memoria.total}</strong></p>
              <p className="cache-debug-info">
                Rápido, mas limpa ao recarregar a página
              </p>
            </div>

            <div className="cache-debug-section">
              <h4>🗄️ LocalStorage Cache</h4>
              <p>Total: <strong>{stats.localStorage.total}</strong></p>
              <p>Válidos: <span className="cache-debug-success">{stats.localStorage.validos}</span></p>
              <p>Expirados: <span className="cache-debug-warning">{stats.localStorage.expirados}</span></p>
              <p className="cache-debug-info">
                Persiste entre sessões do navegador
              </p>
            </div>

            <div className="cache-debug-actions">
              <button onClick={atualizarStats} className="cache-debug-btn">
                🔄 Atualizar
              </button>
              <button onClick={limparExpirados} className="cache-debug-btn">
                🧹 Limpar Expirados
              </button>
              <button onClick={limparTudo} className="cache-debug-btn cache-debug-btn-danger">
                🗑️ Limpar Tudo
              </button>
            </div>

            <div className="cache-debug-legend">
              <p><strong>Como funciona:</strong></p>
              <ol>
                <li>🚀 Primeiro busca na memória (instantâneo)</li>
                <li>💾 Se não achar, busca no localStorage</li>
                <li>🌐 Se não achar, busca da API e salva em ambos</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
