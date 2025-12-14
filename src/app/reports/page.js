'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/header/Header';
import LoadingScreen from '../components/loading/LoadingScreen';
import SendReportButton from '../components/sendReportButton/SendReportButton';
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
    } catch (error_) {
      console.error('Erro ao carregar relatório:', error_);
      alert('Erro ao carregar relatório');
    } finally {
      setCarregando(false);
    }
  };

  const calcularEstatisticasAnuais = () => {
    if (!relatorio || tipo !== 'yearly') return null;
    
    const totalAnual = relatorio.totalGeral;
    const mediaAnual = totalAnual / 12;
    
    return {
      totalAnual,
      mediaAnual
    };
  };

  if (!autenticado) {
    return <LoadingScreen message="Preparando relatórios..." />;
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
              <label htmlFor="filtro-tipo">Tipo de Relatório</label>
              <select
                id="filtro-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="reports-filtros-select"
              >
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div className="reports-filtros-group">
              <label htmlFor="filtro-ano">Ano</label>
              <input
                id="filtro-ano"
                type="number"
                value={ano}
                onChange={(e) => setAno(Number.parseInt(e.target.value, 10))}
                className="reports-filtros-input"
              />
            </div>

            {tipo === 'monthly' && (
              <div className="reports-filtros-group">
                <label htmlFor="filtro-mes">Mês</label>
                <select
                  id="filtro-mes"
                  value={mes}
                  onChange={(e) => setMes(Number.parseInt(e.target.value, 10))}
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

          <div className="reports-filtros-buttons">
            <button onClick={carregarRelatorio} className="reports-btn">
              Gerar Relatório
            </button>
            {relatorio && (
              <SendReportButton 
                type={tipo} 
                year={ano} 
                month={tipo === 'monthly' ? mes : null} 
              />
            )}
          </div>
        </div>

        {carregando && <LoadingScreen message="Gerando relatório..." />}
        
        {!carregando && relatorio ? (
          <div className="reports-resultado">
            <div className="reports-cards-grid">
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

              {tipo === 'yearly' && calcularEstatisticasAnuais() && (
                <>
                  <div className="reports-total">
                    <p className="reports-total-label">Total no Ano</p>
                    <p className="reports-total-valor">
                      R$ {calcularEstatisticasAnuais().totalAnual.toFixed(2)}
                    </p>
                    <p className="reports-total-periodo">Ano {ano}</p>
                  </div>

                  <div className="reports-total">
                    <p className="reports-total-label">Média Mensal</p>
                    <p className="reports-total-valor">
                      R$ {calcularEstatisticasAnuais().mediaAnual.toFixed(2)}
                    </p>
                    <p className="reports-total-periodo">Ano {ano}</p>
                  </div>
                </>
              )}
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
              Selecione os filtros e clique em &quot;Gerar Relatório&quot;
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
