'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/api';
import { GoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import './loginButton.css';

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(0);

  // Resolver hydration error: apenas verificar autenticação no cliente
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthenticated(authService.isAuthenticated());
      setUser(authService.getUser());
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Usar setTimeout para evitar setState síncrono
      const timer = setTimeout(() => setProgress(0), 0);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);

      // credentialResponse.credential é o idToken do Google
      await authService.login(credentialResponse.credential);
      
      setProgress(100);
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        globalThis.location.href = '/expenses';
      }, 500);
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : 'Falha ao fazer login. Tente novamente.';
      setError(mensagemErro);
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Falha ao autenticar com Google.');
    setLoading(false);
  };

  if (isAuthenticated && user) {
    // Suporte para campos em português e inglês
    const imagemUsuario = user.image || user.imagem;
    const nomeUsuario = user.name || user.nome;

    return (
      <div className="login-button-container">
        <div className="user-info">
          {imagemUsuario && (
            <Image 
              src={imagemUsuario} 
              alt={nomeUsuario || 'Usuário'} 
              className="user-avatar"
              width={40}
              height={40}
              referrerPolicy="no-referrer"
              unoptimized
            />
          )}
          <span>Olá, {nomeUsuario || 'Usuário'}</span>
          <button onClick={authService.logout} className="logout-button">
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="login-button-container">
        {error && <div className="error-message">{error}</div>}
        
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_blue"
          size="large"
          text="signin_with"
          shape="rectangular"
          auto_select={false}
        />
      </div>

      {/* Modal de Loading em Tela Cheia */}
      {loading && (
        <div className="loading-modal-overlay">
          <div className="loading-modal-content">
            <Image 
              src="/LOGO_VittaCash.png" 
              alt="VittaCash" 
              width={120} 
              height={120}
              className="loading-logo"
            />
            <h2 className="loading-title">Autenticando...</h2>
            <div className="loading-progress-container">
              <div 
                className="loading-progress-bar" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="loading-percentage">{progress}%</p>
          </div>
        </div>
      )}
    </>
  );
}
