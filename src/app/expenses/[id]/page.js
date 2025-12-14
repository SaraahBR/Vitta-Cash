'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import Header from '../../components/header/Header';
import LoadingScreen from '../../components/loading/LoadingScreen';
import ExpenseForm from '../../components/expenseForm/ExpenseForm';
import { authService, obterDespesa, atualizarDespesa } from '../../../services/api';
import './edit.css';

import PropTypes from 'prop-types';

export default function EditExpensePage({ params }) {
  // Desembrulhar a Promise params com React.use()
  const { id } = use(params);
  
  const router = useRouter();
  const [despesa, setDespesa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  const carregarDespesa = useCallback(async () => {
    try {
      const dados = await obterDespesa(id);
      setDespesa(dados);
    } catch (error_) {
      console.error('Erro ao carregar despesa:', error_);
      alert('Erro ao carregar despesa');
      router.push('/expenses');
    } finally {
      setCarregando(false);
    }
  }, [id, router]);

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
  }, [id, router, carregarDespesa]);

  const handleSalvar = async (dados) => {
    try {
      await atualizarDespesa(id, dados);
      router.push('/expenses');
    } catch (error_) {
      throw new Error(error_.response?.data?.mensagem || 'Erro ao atualizar despesa');
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

EditExpensePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};
