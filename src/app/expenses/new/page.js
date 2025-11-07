'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Header from '../../components/header/Header';
import ExpenseForm from '../../components/expenseForm/ExpenseForm';
import { authService, criarDespesa } from '../../../services/api';
import './new.css';

export default function NewExpensePage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    setAutenticado(isAuth);
    
    if (!isAuth) {
      router.push('/');
    }
  }, [router]);

  const handleSalvar = async (dados) => {
    try {
      await criarDespesa(dados);
      router.push('/expenses');
    } catch (erro) {
      throw new Error(erro.response?.data?.mensagem || 'Erro ao criar despesa');
    }
  };

  const handleCancelar = () => {
    router.push('/expenses');
  };

  if (!autenticado) {
    return (
      <Layout>
        <div className="new-container">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
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
