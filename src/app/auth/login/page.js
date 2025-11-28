'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import LoadingScreen from '@/app/components/loading/LoadingScreen';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErro(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      // URL do backend Node.js/Express (Render)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vittacash.onrender.com';
      const url = `${backendUrl}/api/auth/login`;
      
      console.log('📤 Fazendo login em:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Salvar token e usuário
      if (globalThis.window !== undefined) {
        localStorage.setItem('vittacash_token', data.token);
        localStorage.setItem('vittacash_user', JSON.stringify(data.usuario));
      }

      // Redirecionar
      router.push('/expenses');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setErro(null);

      // URL do backend Node.js/Express (Render) para login Google
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vittacash.onrender.com';
      const url = `${backendUrl}/api/auth/login-google`;
      
      console.log('📤 Fazendo login Google em:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenGoogle: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login com Google');
      }

      // Salvar token e usuário
      if (globalThis.window !== undefined) {
        localStorage.setItem('vittacash_token', data.token);
        localStorage.setItem('vittacash_user', JSON.stringify(data.usuario));
      }

      // Redirecionar
      router.push('/expenses');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErro('Falha ao autenticar com Google');
  };

  if (loading) {
    return <LoadingScreen message="Autenticando..." />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <Image 
            src="/LOGO_VittaCash.png" 
            alt="VittaCash" 
            width={80} 
            height={80}
            priority
          />
        </div>
        <h1>Entrar</h1>
        <p className="login-subtitulo">Acesse sua conta do VittaCash</p>

        {erro && (
          <div className="erro-mensagem">
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="divisor">
          <span>ou</span>
        </div>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            locale="pt-BR"
          />
        </div>

        <div className="login-footer">
          <p>
            Não tem uma conta?{' '}
            <Link href="/auth/cadastro" className="link-cadastro">
              Criar conta
            </Link>
          </p>
          <Link href="/auth/reenviar-verificacao" className="link-reenviar">
            Reenviar e-mail de verificação
          </Link>
        </div>
      </div>
    </div>
  );
}
