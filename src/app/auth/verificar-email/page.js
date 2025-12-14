'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './verificar-email.css';

function VerificarEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verificando'); // verificando | sucesso | erro
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const verificarEmail = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!email || !token) {
        setStatus('erro');
        setMensagem('Link de verificação inválido');
        return;
      }

      try {
        // URL do backend Node.js/Express (Render)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vittacash.onrender.com';
        const url = `${backendUrl}/api/auth/verificar-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
        
        console.log('📤 Verificando email em:', url);
        
        const response = await fetch(url);

        const data = await response.json();
        console.log('📥 Resposta:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao verificar e-mail');
        }

        // Salvar token e usuário
        if (globalThis.window !== undefined) {
          localStorage.setItem('vittacash_token', data.token);
          localStorage.setItem('vittacash_user', JSON.stringify(data.usuario));
        }

        setStatus('sucesso');
        setMensagem(data.mensagem);

        // Redirecionar após 3 segundos
        setTimeout(() => {
          router.push('/expenses');
        }, 3000);
      } catch (err) {
        setStatus('erro');
        setMensagem(err.message);
      }
    };

    verificarEmail();
  }, [searchParams, router]);

  return (
    <div className="verificar-container">
      <div className="verificar-card">
        {status === 'verificando' && (
          <>
            <div className="loader"></div>
            <h1>Verificando e-mail...</h1>
            <p>Aguarde um momento enquanto confirmamos seu e-mail.</p>
          </>
        )}

        {status === 'sucesso' && (
          <>
            <div className="sucesso-icon">✅</div>
            <h1>E-mail Verificado!</h1>
            <p className="sucesso-mensagem">{mensagem}</p>
            <p className="redirect-info">
              Você será redirecionado automaticamente em alguns segundos...
            </p>
            <Link href="/expenses" className="btn-continuar">
              Continuar para o Dashboard
            </Link>
          </>
        )}

        {status === 'erro' && (
          <>
            <div className="erro-icon">❌</div>
            <h1>Erro na Verificação</h1>
            <p className="erro-mensagem">{mensagem}</p>
            <div className="erro-acoes">
              <Link href="/auth/reenviar-verificacao" className="btn-reenviar">
                Reenviar E-mail de Verificação
              </Link>
              <Link href="/" className="btn-cadastrar-novamente">
                Cadastrar Novamente
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerificarEmailPage() {
  return (
    <Suspense fallback={
      <div className="verificar-container">
        <div className="verificar-card">
          <div className="loader"></div>
          <h1>Carregando...</h1>
        </div>
      </div>
    }>
      <VerificarEmailContent />
    </Suspense>
  );
}
