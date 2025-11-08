'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Header from '../components/header/Header';
import LoadingScreen from '../components/loading/LoadingScreen';
import { authService, listarDespesas, excluirDespesa } from '../../services/api';
import { formatarData } from '../../lib/formatadores';
import './expenses.css';

export default function ExpensesPage() {
  const router = useRouter();
  const [despesas, setDespesas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [filtros, setFiltros] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    categoria: '',
  });

  useEffect(() => {
    const verificarAuth = () => {
      const isAuth = authService.isAuthenticated();
      setAutenticado(isAuth);
      
      if (!isAuth) {
        router.push('/');
      } else {
        // Debounce: aguarda 300ms após mudança de filtro antes de buscar
        const timeoutId = setTimeout(() => {
          carregarDespesas();
        }, 300);
        
        return () => clearTimeout(timeoutId);
      }
    };

    return verificarAuth();
  }, [filtros]);

  const carregarDespesas = useCallback(async () => {
    try {
      setCarregando(true);
      
      const dados = await listarDespesas(filtros);
      setDespesas(dados);
    } catch (erro) {
      console.error('Erro ao carregar despesas:', erro);
      setDespesas([]); // Fallback para array vazio
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await excluirDespesa(id);
        carregarDespesas();
      } catch (erro) {
        console.error('Erro ao excluir despesa:', erro);
        alert('Erro ao excluir despesa');
      }
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const limparFiltros = () => {
    setFiltros({
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      categoria: '',
    });
  };

  if (!autenticado || carregando) {
    return <LoadingScreen message="Carregando despesas..." />;
  }

  return (
    <Layout>
      <div className="expenses-container">
        <Header
          titulo="Minhas Despesas"
          subtitulo="Gerencie todas as suas despesas"
          acoes={
            <Link href="/expenses/new" className="expenses-btn expenses-btn-primary">
              + Nova Despesa
            </Link>
          }
        />

        <div className="expenses-filtros">
          <div className="expenses-filtros-grid">
            <div className="expenses-filtros-group">
              <label>Mês</label>
              <select
                name="mes"
                value={filtros.mes}
                onChange={handleFiltroChange}
                className="expenses-filtros-select"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="expenses-filtros-group">
              <label>Ano</label>
              <input
                type="number"
                name="ano"
                value={filtros.ano}
                onChange={handleFiltroChange}
                className="expenses-filtros-input"
              />
            </div>

            <div className="expenses-filtros-group">
              <label>Categoria</label>
              <select
                name="categoria"
                value={filtros.categoria}
                onChange={handleFiltroChange}
                className="expenses-filtros-select"
              >
                <option value="">Todas</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Moradia">Moradia</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Lazer">Lazer</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="expenses-filtros-actions">
            <button
              onClick={limparFiltros}
              className="expenses-btn expenses-btn-clear"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {despesas.length > 0 ? (
          <div className="expenses-lista">
            {despesas.map((despesa) => (
              <div key={despesa.id} className="expenses-card">
                <div className="expenses-card-info">
                  <h3 className="expenses-card-titulo">
                    {despesa.descricao || despesa.titulo || despesa.title || 'Sem título'}
                  </h3>
                  <div className="expenses-card-detalhes">
                    <span>📅 {formatarData(despesa.date || despesa.data)}</span>
                    <span>📁 {despesa.category || despesa.categoria}</span>
                    {(despesa.recurring || despesa.recorrente) && <span>🔄 Recorrente</span>}
                  </div>
                </div>
                <span className="expenses-card-valor">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(despesa.amount || despesa.valor)}
                </span>
                <div className="expenses-card-actions">
                  <Link
                    href={`/expenses/${despesa.id}`}
                    className="expenses-btn expenses-btn-primary"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleExcluir(despesa.id)}
                    className="expenses-btn expenses-btn-secondary"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="expenses-vazio">
            <div className="expenses-vazio-icon">📭</div>
            <p className="expenses-vazio-texto">Nenhuma despesa encontrada</p>
            <Link href="/expenses/new" className="expenses-btn expenses-btn-primary">
              Criar primeira despesa
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
