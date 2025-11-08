'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Layout from '../../components/layout/Layout';
import Header from '../../components/header/Header';
import LoadingScreen from '../../components/loading/LoadingScreen';
import ExpenseForm from '../../components/expenseForm/ExpenseForm';
import { authService, obterDespesa, atualizarDespesa } from '../../../services/api';
import './edit.css';

export default function EditExpensePage({ params }) {
  // Desembrulhar a Promise params com React.use()
  const { id } = use(params);
  
  const router = useRouter();
  const [despesa, setDespesa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const verificarAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setAutenticado(isAuth);
      
      if (!isAuth) {
        router.push('/');
      } else if (id) {
        await carregarDespesa();
      }
    };

    verificarAuth();
  }, [id, router]);

  const carregarDespesa = async () => {
    try {
      const dados = await obterDespesa(id);
      setDespesa(dados);
    } catch (erro) {
      console.error('Erro ao carregar despesa:', erro);
      alert('Erro ao carregar despesa');
      router.push('/expenses');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async (dados) => {
    try {
      await atualizarDespesa(id, dados);
      router.push('/expenses');
    } catch (erro) {
      throw new Error(erro.response?.data?.mensagem || 'Erro ao atualizar despesa');
    }
  };

  const handleCancelar = () => {
    router.push('/expenses');
  };

  if (!autenticado || carregando) {
    return <LoadingScreen message="Carregando despesa..." />;
  }

  return (
    <Layout>
      <div className="edit-container">
        <Header
          titulo="Editar Despesa"
          subtitulo="Atualize os dados da sua despesa"
        />
        <ExpenseForm
          despesaInicial={despesa}
          aoSalvar={handleSalvar}
          aoCancelar={handleCancelar}
        />
      </div>
    </Layout>
  );
}
