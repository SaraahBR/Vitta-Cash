'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/header/Header';
import { authService, obterRelatorio } from '../../services/api';
import './reports.css';

export default function ReportsPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [tipo, setTipo] = useState('monthly');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    setAutenticado(isAuth);
    
    if (!isAuth) {
      router.push('/');
    }
  }, [router]);

  const carregarRelatorio = async () => {
    try {
      setCarregando(true);
      const dados = await obterRelatorio(tipo, ano, tipo === 'monthly' ? mes : null);
      setRelatorio(dados);
    } catch (erro) {
      console.error('Erro ao carregar relatório:', erro);
      alert('Erro ao carregar relatório');
    } finally {
      setCarregando(false);
    }
  };

  if (!autenticado) {
    return (
      <Layout>
        <div className="reports-container">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="reports-container">
        <Header
          titulo="Relatórios"
          subtitulo="Visualize relatórios detalhados das suas despesas"
        />

        <div className="reports-filtros">
          <div className="reports-filtros-grid">
            <div className="reports-filtros-group">
              <label>Tipo de Relatório</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="reports-filtros-select"
              >
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div className="reports-filtros-group">
              <label>Ano</label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(parseInt(e.target.value))}
                className="reports-filtros-input"
              />
            </div>

            {tipo === 'monthly' && (
              <div className="reports-filtros-group">
                <label>Mês</label>
                <select
                  value={mes}
                  onChange={(e) => setMes(parseInt(e.target.value))}
                  className="reports-filtros-select"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button onClick={carregarRelatorio} className="reports-btn">
            Gerar Relatório
          </button>
        </div>

        {carregando ? (
          <p>Carregando relatório...</p>
        ) : relatorio ? (
          <div className="reports-resultado">
            <div className="reports-total">
              <p className="reports-total-label">Total Gasto</p>
              <p className="reports-total-valor">
                R$ {relatorio.totalGeral.toFixed(2)}
              </p>
              <p className="reports-total-periodo">
                {tipo === 'monthly'
                  ? `${mes}/${ano}`
                  : `Ano ${ano}`}
              </p>
            </div>

            {tipo === 'monthly' && relatorio.categorias && (
              <div className="reports-secao">
                <h3>Gastos por Categoria</h3>
                {relatorio.categorias.map((cat) => (
                  <div key={cat.categoria} className="reports-item">
                    <span className="reports-item-nome">{cat.categoria}</span>
                    <span className="reports-item-valor">
                      R$ {cat.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tipo === 'yearly' && relatorio.meses && (
              <div className="reports-secao">
                <h3>Gastos por Mês</h3>
                {relatorio.meses.map((m) => (
                  <div key={m.mes} className="reports-item">
                    <span className="reports-item-nome">Mês {m.mes}</span>
                    <span className="reports-item-valor">
                      R$ {m.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="reports-resultado">
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              Selecione os filtros e clique em "Gerar Relatório"
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
