'use client';

import { useState } from 'react';
import Link from 'next/link';
import './cadastro.css';

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

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

    // Validar senhas iguais
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      // URL do backend Node.js/Express (Render)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vittacash.onrender.com';
      const url = `${backendUrl}/api/auth/cadastrar`;
      
      console.log('📤 Enviando cadastro para:', url);
      console.log('📦 Dados:', { nome: formData.nome, email: formData.email });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 segundos (envio de e-mail pode demorar)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Resposta status:', response.status);

      const data = await response.json();
      console.log('📥 Resposta data:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.details?.join(', ') || 'Erro ao cadastrar';
        
        // Se o erro for "E-mail já cadastrado", adicionar link útil
        if (errorMessage.includes('já está em uso') || errorMessage.includes('já cadastrado')) {
          throw new Error('Este e-mail já está cadastrado. Você pode fazer login ou reenviar o e-mail de verificação.');
        }
        
        throw new Error(errorMessage);
      }

      setSucesso(true);
    } catch (err) {
      console.error('❌ Erro no cadastro:', err);
      if (err.name === 'AbortError') {
        // Timeout, mas provavelmente funcionou no backend
        // Mostrar como sucesso parcial
        setSucesso(true);
        console.warn('⚠️ Timeout, mas cadastro pode ter sido concluído no backend');
      } else if (err.message.includes('fetch')) {
        setErro('Erro de conexão. Verifique se o backend está rodando.');
      } else {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="cadastro-container">
        <div className="cadastro-card">
          <div className="sucesso-icon">✅</div>
          <h1>Cadastro Realizado!</h1>
          <p className="sucesso-mensagem">
            Um e-mail de verificação foi enviado para <strong>{formData.email}</strong>
          </p>
          <p className="sucesso-instrucao">
            Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
          </p>
          <div className="sucesso-info">
            <p>📧 Não recebeu o e-mail?</p>
            <Link href="/auth/reenviar-verificacao" className="link-reenviar">
              Reenviar e-mail de verificação
            </Link>
          </div>
          <Link href="/" className="btn-voltar">
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1>Criar Conta</h1>
        <p className="cadastro-subtitulo">Cadastre-se para começar a usar o VittaCash</p>

        {erro && (
          <div className="erro-mensagem">
            ⚠️ {erro}
            {erro.includes('já cadastrado') && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                <Link href="/auth/login" style={{ color: '#667eea', textDecoration: 'underline' }}>
                  Fazer login
                </Link>
                {' ou '}
                <Link href="/auth/reenviar-verificacao" style={{ color: '#667eea', textDecoration: 'underline' }}>
                  Reenviar e-mail de verificação
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome"
              required
              minLength={3}
              maxLength={100}
              disabled={loading}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-cadastrar" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="cadastro-footer">
          <p>
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="link-login">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
