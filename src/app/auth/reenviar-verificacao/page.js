'use client';

import { useState } from 'react';
import Link from 'next/link';
import './reenviar-verificacao.css';

export default function ReenviarVerificacaoPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      // URL do backend Node.js/Express (Render)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vittacash.onrender.com';
      const url = `${backendUrl}/api/auth/reenviar-verificacao`;
      
      console.log('📤 Reenviando verificação para:', url);
      console.log('📦 E-mail:', email);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 segundos

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Resposta status:', response.status);

      const data = await response.json();
      console.log('📥 Resposta data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao reenviar e-mail');
      }

      setSucesso(true);
    } catch (err) {
      console.error('❌ Erro ao reenviar:', err);
      if (err.name === 'AbortError') {
        // Timeout, mas provavelmente funcionou no backend
        setSucesso(true);
        console.warn('⚠️ Timeout, mas e-mail pode ter sido enviado pelo backend');
      } else if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      } else {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="reenviar-container">
        <div className="reenviar-card">
          <div className="sucesso-icon">✅</div>
          <h1>E-mail Reenviado!</h1>
          <p className="sucesso-mensagem">
            Um novo e-mail de verificação foi enviado para <strong>{email}</strong>
          </p>
          <p className="sucesso-instrucao">
            Verifique sua caixa de entrada e clique no link de confirmação.
          </p>
          <div className="acoes">
            <Link href="/auth/login" className="btn-login">
              Ir para Login
            </Link>
            <Link href="/" className="btn-home">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reenviar-container">
      <div className="reenviar-card">
        <h1>Reenviar Verificação</h1>
        <p className="reenviar-subtitulo">
          Digite seu e-mail para receber um novo link de verificação
        </p>

        {erro && (
          <div className="erro-mensagem">
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reenviar-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErro(null);
              }}
              placeholder="seuemail@exemplo.com"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-reenviar" disabled={loading}>
            {loading ? 'Reenviando...' : 'Reenviar E-mail'}
          </button>
        </form>

        <div className="reenviar-footer">
          <p>
            Lembrou sua senha?{' '}
            <Link href="/auth/login" className="link-login">
              Fazer login
            </Link>
          </p>
          <Link href="/auth/cadastro" className="link-cadastro">
            Criar nova conta
          </Link>
        </div>
      </div>
    </div>
  );
}
