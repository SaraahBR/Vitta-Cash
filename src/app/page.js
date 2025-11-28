'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from './components/layout/Layout';
import Hero from './components/hero/Hero';
import Header from './components/header/Header';
import LoadingScreen from './components/loading/LoadingScreen';
import { authService, obterRelatorio } from '../services/api';
import './page.css';

const PieChartCategories = dynamic(
  () => import('./components/charts/ReportsCharts').then(mod => mod.PieChartCategories),
  { ssr: false }
);

const BarChartMonths = dynamic(
  () => import('./components/charts/ReportsCharts').then(mod => mod.BarChartMonths),
  { ssr: false }
);

export default function Home() {
  const [autenticado, setAutenticado] = useState(false);
  const [relatorioMensal, setRelatorioMensal] = useState(null);
  const [relatorioAnual, setRelatorioAnual] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarAuth = () => {
      const isAuth = authService.isAuthenticated();
      setAutenticado(isAuth);
      
      if (isAuth) {
        carregarRelatorios();
      } else {
        setCarregando(false);
      }
    };

    verificarAuth();
  }, []);

  const carregarRelatorios = async () => {
    try {
      const hoje = new Date();
      const anoAtual = hoje.getFullYear();
      const mesAtual = hoje.getMonth() + 1;

      // Busca paralela com cache automático
      const [mensal, anual] = await Promise.all([
        obterRelatorio('monthly', anoAtual, mesAtual),
        obterRelatorio('yearly', anoAtual),
      ]);

      setRelatorioMensal(mensal);
      setRelatorioAnual(anual);
      
      // Pré-carrega dados do próximo mês em background
      setTimeout(() => {
        const proximoMes = mesAtual === 12 ? 1 : mesAtual + 1;
        const proximoAno = mesAtual === 12 ? anoAtual + 1 : anoAtual;
        obterRelatorio('monthly', proximoAno, proximoMes).catch(() => {});
      }, 1000);
    } catch (error_) {
      console.error('Erro ao carregar relatórios:', error_);
    } finally {
      setCarregando(false);
    }
  };

  if (!autenticado) {
    return (
      <Layout>
        <Hero />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <Header 
          titulo="Dashboard" 
          subtitulo="Visão geral das suas finanças"
        />

        <main className="page-main">
          {carregando && <LoadingScreen message="Carregando dashboard..." />}
          
          {!carregando && (
            <>
              <section className="page-resumo">
                <div className="page-card">
                  <h2>Resumo do Mês</h2>
                  {relatorioMensal && (
                    <>
                      <p className="page-total">
                        R$ {relatorioMensal.totalGeral.toFixed(2)}
                      </p>
                      <p className="page-subtitulo">
                        {relatorioMensal.mes}/{relatorioMensal.ano}
                      </p>
                    </>
                  )}
                </div>

                <div className="page-card">
                  <h2>Resumo do Ano</h2>
                  {relatorioAnual && (
                    <>
                      <p className="page-total">
                        R$ {relatorioAnual.totalGeral.toFixed(2)}
                      </p>
                      <p className="page-subtitulo">{relatorioAnual.ano}</p>
                    </>
                  )}
                </div>
              </section>

              {/* Gráfico de Gastos Mensais por Categoria */}
              {relatorioMensal?.porCategoria?.length > 0 && (
                <section className="page-graficos">
                  <h3>Gastos por Categoria (Este Mês)</h3>
                  <PieChartCategories data={relatorioMensal.porCategoria} />
                </section>
              )}

              {/* Gráfico de Gastos Anuais por Mês */}
              {relatorioAnual?.porMes?.length > 0 && (
                <section className="page-graficos">
                  <h3>Gastos por Mês (Este Ano)</h3>
                  <BarChartMonths data={relatorioAnual.porMes} />
                </section>
              )}

              {/* Detalhamento das Categorias */}
              {relatorioMensal?.porCategoria && (
                <section className="page-categorias">
                  <h3>Detalhamento de Categorias (Este Mês)</h3>
                  {relatorioMensal.porCategoria.map((cat) => (
                    <div key={cat.categoria} className="page-categoria-item">
                      <span className="page-categoria-nome">{cat.categoria}</span>
                      <span className="page-categoria-valor">
                        R$ {cat.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}
