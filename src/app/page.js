'use client';

import { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/hero/Hero';
import Header from './components/header/Header';
import { authService } from '../services/api';
import { obterRelatorio } from '../services/api';
import './page.css';

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

      const [mensal, anual] = await Promise.all([
        obterRelatorio('monthly', anoAtual, mesAtual),
        obterRelatorio('yearly', anoAtual),
      ]);

      setRelatorioMensal(mensal);
      setRelatorioAnual(anual);
    } catch (erro) {
      console.error('Erro ao carregar relatórios:', erro);
    } finally {
      setCarregando(false);
    }
  };

  if (!autenticado) {
    return (
      <Layout semFooter>
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
          {carregando ? (
            <p>Carregando relatórios...</p>
          ) : (
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

              {relatorioMensal && relatorioMensal.categorias && (
                <section className="page-categorias">
                  <h3>Gastos por Categoria (Este Mês)</h3>
                  {relatorioMensal.categorias.map((cat) => (
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
