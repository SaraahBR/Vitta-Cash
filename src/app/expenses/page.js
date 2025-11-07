'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Header from '../components/header/Header';
import { authService, listarDespesas, excluirDespesa } from '../../services/api';
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
        carregarDespesas();
      }
    };

    verificarAuth();
  }, [filtros]);

  const carregarDespesas = async () => {
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
  };

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

  if (!autenticado) {
    return (
      <Layout>
        <div className="expenses-container">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
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
              className="expenses-btn expenses-btn-secondary"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {carregando ? (
          <p>Carregando despesas...</p>
        ) : despesas.length > 0 ? (
          <div className="expenses-lista">
            {despesas.map((despesa) => (
              <div key={despesa.id} className="expenses-card">
                <div className="expenses-card-info">
                  <h3 className="expenses-card-titulo">{despesa.titulo}</h3>
                  <div className="expenses-card-detalhes">
                    <span>📅 {new Date(despesa.data).toLocaleDateString('pt-BR')}</span>
                    <span>📁 {despesa.categoria}</span>
                    {despesa.recorrente && <span>🔄 Recorrente</span>}
                  </div>
                </div>
                <span className="expenses-card-valor">
                  R$ {despesa.valor.toFixed(2)}
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
