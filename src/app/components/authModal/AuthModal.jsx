'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '@/services/api';
import './authModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login'); // 'login' ou 'cadastro'
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [progress, setProgress] = useState(0);

  const [loginData, setLoginData] = useState({
    email: '',
    senha: '',
  });

  const [cadastroData, setCadastroData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

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
      setProgress(0);
    }
  }, [loading]);

  // Bloquear scroll da página quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      // Rolar para o topo imediatamente
      window.scrollTo(0, 0);
      
      // Bloquear scroll do body e html
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restaurar scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup ao desmontar
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Login comum
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
      }

      router.push('/expenses');
      onClose();
    } catch (error) {
      console.error('Erro no login:', error);
      setErro(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    if (cadastroData.senha !== cadastroData.confirmarSenha) {
      setErro('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/cadastrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cadastroData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }

      setSucesso(true);
      setTimeout(() => {
        setActiveTab('login');
        setSucesso(false);
      }, 3000);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErro(error.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setErro(null);

      const { token, usuario } = await authService.login(credentialResponse.credential);

      console.log('Login Google bem-sucedido:', usuario);
      
      setProgress(100);
      
      setTimeout(() => {
        router.push('/expenses');
        onClose();
      }, 500);
    } catch (err) {
      console.error('Erro no login Google:', err);
      setErro('Falha ao fazer login com Google. Tente novamente.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErro('Falha ao autenticar com Google.');
    setLoading(false);
  };

  return (
    <>
      {/* Overlay com Blur */}
      <div className="auth-modal-overlay" onClick={onClose}>
        <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Cabeçalho */}
          <div className="auth-modal-header">
            <Image 
              src="/LOGO_VittaCash.png" 
              alt="VittaCash" 
              width={50} 
              height={50}
              className="auth-modal-logo"
            />
            <h2 className="auth-modal-title">Bem-vindo ao VittaCash</h2>
            <button className="auth-modal-close" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="auth-modal-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setErro(null);
                setSucesso(false);
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === 'cadastro' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('cadastro');
                setErro(null);
                setSucesso(false);
              }}
            >
              Cadastro
            </button>
          </div>

          {/* Mensagens */}
          {erro && (
            <div className="auth-modal-error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="auth-modal-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cadastro realizado com sucesso! Redirecionando para login...
            </div>
          )}

          {/* Conteúdo */}
          <div className="auth-modal-body">
            {activeTab === 'login' ? (
              <div className="auth-form-container">
                <form onSubmit={handleLoginSubmit} className="auth-form">
                  <div className="auth-form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="login-senha">Senha</label>
                    <input
                      type="password"
                      id="login-senha"
                      name="senha"
                      value={loginData.senha}
                      onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>

                <div className="auth-divider">
                  <span>ou</span>
                </div>

                <div className="auth-google-container">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width="100%"
                  />
                </div>
              </div>
            ) : (
              <div className="auth-form-container">
                <form onSubmit={handleCadastroSubmit} className="auth-form">
                  <div className="auth-form-group">
                    <label htmlFor="cadastro-nome">Nome Completo</label>
                    <input
                      type="text"
                      id="cadastro-nome"
                      name="nome"
                      value={cadastroData.nome}
                      onChange={(e) => setCadastroData({ ...cadastroData, nome: e.target.value })}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="cadastro-email">Email</label>
                    <input
                      type="email"
                      id="cadastro-email"
                      name="email"
                      value={cadastroData.email}
                      onChange={(e) => setCadastroData({ ...cadastroData, email: e.target.value })}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="cadastro-senha">Senha</label>
                    <input
                      type="password"
                      id="cadastro-senha"
                      name="senha"
                      value={cadastroData.senha}
                      onChange={(e) => setCadastroData({ ...cadastroData, senha: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="cadastro-confirmar">Confirmar Senha</label>
                    <input
                      type="password"
                      id="cadastro-confirmar"
                      name="confirmarSenha"
                      value={cadastroData.confirmarSenha}
                      onChange={(e) => setCadastroData({ ...cadastroData, confirmarSenha: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </button>
                </form>

                <div className="auth-divider">
                  <span>ou</span>
                </div>

                <div className="auth-google-container">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signup_with"
                    shape="rectangular"
                    width="100%"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
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
