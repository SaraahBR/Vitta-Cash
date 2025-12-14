'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService, criarDespesa } from '../../../services/api';
import './new.css';

// Dynamic imports para componentes usados condicionalmente
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('../../components/layout/Layout'));
const Header = dynamic(() => import('../../components/header/Header'));
const LoadingScreen = dynamic(() => import('../../components/loading/LoadingScreen'));
const ExpenseForm = dynamic(() => import('../../components/expenseForm/ExpenseForm'));

export default function NewExpensePage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    // Usar setTimeout para evitar setState síncrono
    const timer = setTimeout(() => {
      const isAuth = authService.isAuthenticated();
      setAutenticado(isAuth);
      
      if (!isAuth) {
        router.push('/');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  const handleSalvar = async (dados) => {
    try {
      await criarDespesa(dados);
      router.push('/expenses');
    } catch (error_) {
      throw new Error(error_.response?.data?.mensagem || 'Erro ao criar despesa');
    }
  };

  const handleCancelar = () => {
    router.push('/expenses');
  };

  if (!autenticado) {
    return <LoadingScreen message="Preparando formulário..." />;
  }

  return (
    <Layout>
      <div className="new-container">
        <Header
          titulo="Nova Despesa"
          subtitulo="Adicione uma nova despesa ao seu registro"
        />
        <ExpenseForm aoSalvar={handleSalvar} aoCancelar={handleCancelar} />
      </div>
    </Layout>
  );
}
