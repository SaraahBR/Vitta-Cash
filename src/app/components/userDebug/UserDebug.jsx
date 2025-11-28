'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/api';
import './userDebug.css';

/**
 * Componente de Debug para verificar dados do usuário
 * Use apenas em desenvolvimento
 */
export default function UserDebug() {
  const [mostrar, setMostrar] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [rawData, setRawData] = useState('');

  useEffect(() => {
    if (mostrar) {
      const user = authService.getUser();
      setUsuario(user);
      setRawData(JSON.stringify(user, null, 2));
    }
  }, [mostrar]);

  const copiarDados = () => {
    navigator.clipboard.writeText(rawData);
    alert('Dados copiados para a área de transferência!');
  };

  const limparERelogar = () => {
    if (confirm('Isso vai fazer logout e limpar o localStorage. Continuar?')) {
      localStorage.clear();
      globalThis.location.href = '/';
    }
  };

  return (
    <>
      <button
        onClick={() => setMostrar(!mostrar)}
        className="user-debug-toggle"
        title="Debug do Usuário"
      >
        👤
      </button>

      {mostrar && (
        <div className="user-debug-panel">
          <div className="user-debug-header">
            <h3>👤 User Debug</h3>
            <button onClick={() => setMostrar(false)}>✕</button>
          </div>

          <div className="user-debug-body">
            <div className="user-debug-section">
              <h4>📋 Dados do LocalStorage</h4>
              <pre className="user-debug-code">{rawData || 'Nenhum dado encontrado'}</pre>
              <button onClick={copiarDados} className="user-debug-btn">
                📋 Copiar JSON
              </button>
            </div>

            <div className="user-debug-section">
              <h4>📸 Preview da Imagem</h4>
              {(usuario?.image || usuario?.imagem) ? (
                <div>
                  <img 
                    src={usuario.image || usuario.imagem} 
                    alt="Preview"
                    className="user-debug-img"
                    onError={(e) => {
                      e.target.style.border = '2px solid red';
                      e.target.alt = '❌ Erro ao carregar imagem';
                    }}
                  />
                  <p className="user-debug-url">
                    <strong>URL:</strong> <br />
                    <code>{usuario.image || usuario.imagem}</code>
                  </p>
                  <a 
                    href={usuario.image || usuario.imagem} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="user-debug-link"
                  >
                    🔗 Abrir URL em nova aba
                  </a>
                </div>
              ) : (
                <div className="user-debug-warning">
                  ⚠️ Campo "image" ou "imagem" não encontrado ou está vazio!
                  <p>Verifique se o backend está retornando o campo "image" ou "imagem".</p>
                </div>
              )}
            </div>

            <div className="user-debug-section">
              <h4>🔍 Checklist</h4>
              <ul className="user-debug-checklist">
                <li className={usuario?.id ? 'check-ok' : 'check-error'}>
                  {usuario?.id ? '✅' : '❌'} Campo "id" presente
                </li>
                <li className={usuario?.email ? 'check-ok' : 'check-error'}>
                  {usuario?.email ? '✅' : '❌'} Campo "email" presente
                </li>
                <li className={(usuario?.name || usuario?.nome) ? 'check-ok' : 'check-error'}>
                  {(usuario?.name || usuario?.nome) ? '✅' : '❌'} Campo "name" ou "nome" presente
                </li>
                <li className={(usuario?.image || usuario?.imagem) ? 'check-ok' : 'check-error'}>
                  {(usuario?.image || usuario?.imagem) ? '✅' : '⚠️'} Campo "image" ou "imagem" presente
                </li>
                <li className={(usuario?.image?.startsWith('http') || usuario?.imagem?.startsWith('http')) ? 'check-ok' : 'check-error'}>
                  {(usuario?.image?.startsWith('http') || usuario?.imagem?.startsWith('http')) ? '✅' : '❌'} URL da imagem válida
                </li>
              </ul>
            </div>

            <div className="user-debug-actions">
              <button onClick={limparERelogar} className="user-debug-btn user-debug-btn-danger">
                🔄 Limpar e Relogar
              </button>
            </div>

            <div className="user-debug-help">
              <p><strong>💡 Dica:</strong></p>
              <p>Se o campo "image" não existe ou está vazio:</p>
              <ol>
                <li>Faça logout e login novamente</li>
                <li>Verifique se o backend está retornando "image" na resposta do login</li>
                <li>Verifique se o Google OAuth está configurado corretamente</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
