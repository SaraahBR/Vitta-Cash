'use client';

import PropTypes from 'prop-types';

/**
 * Painel de Debug do Cache - Componente extraído para reduzir aninhamento JSX
 */
export default function CacheDebugPanel({ stats, onClose, onRefresh, onClearExpired, onClearAll }) {
  return (
    <div className="cache-debug-panel">
      <div className="cache-debug-header">
        <h3>📊 Cache Debug</h3>
        <button onClick={onClose}>✕</button>
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
          <button onClick={onRefresh} className="cache-debug-btn">
            🔄 Atualizar
          </button>
          <button onClick={onClearExpired} className="cache-debug-btn">
            🧹 Limpar Expirados
          </button>
          <button onClick={onClearAll} className="cache-debug-btn cache-debug-btn-danger">
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
  );
}

CacheDebugPanel.propTypes = {
  stats: PropTypes.shape({
    memoria: PropTypes.shape({
      total: PropTypes.number.isRequired,
    }).isRequired,
    localStorage: PropTypes.shape({
      total: PropTypes.number.isRequired,
      validos: PropTypes.number.isRequired,
      expirados: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onClearExpired: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};
