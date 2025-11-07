//
// Relatórios de despesas (mensal e anual)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

/**
 * GET /api/expenses/report?type=monthly&year=2025&month=11
 * ou
 * GET /api/expenses/report?type=yearly&year=2025
 * 
 * Retorna agregações de despesas por categoria (mensal) ou por mês (anual)
 */
export async function GET(request) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao || !sessao.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  const userId = sessao.user.id;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  if (!type || !year) {
    return NextResponse.json({ erro: 'Parâmetros "type" e "year" são obrigatórios' }, { status: 400 });
  }

  try {
    if (type === 'monthly') {
      return await relatorioMensal(userId, year, month);
    } else if (type === 'yearly') {
      return await relatorioAnual(userId, year);
    } else {
      return NextResponse.json({ erro: 'Tipo de relatório inválido (use "monthly" ou "yearly")' }, { status: 400 });
    }
  } catch (erro) {
    console.error('Erro ao gerar relatório:', erro);
    return NextResponse.json({ erro: 'Erro ao gerar relatório' }, { status: 500 });
  }
}

/**
 * Relatório mensal: totais por categoria
 */
async function relatorioMensal(userId, year, month) {
  const anoNum = parseInt(year, 10);
  const mesNum = month ? parseInt(month, 10) : new Date().getMonth() + 1;

  if (mesNum < 1 || mesNum > 12) {
    return NextResponse.json({ erro: 'Mês inválido (1-12)' }, { status: 400 });
  }

  const dataInicio = new Date(anoNum, mesNum - 1, 1);
  const dataFim = new Date(anoNum, mesNum, 0, 23, 59, 59);

  // Buscar despesas do mês
  const despesas = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: dataInicio,
        lte: dataFim,
      },
    },
  });

  // Agregar por categoria
  const porCategoria = {};
  let totalGeral = 0;

  despesas.forEach((despesa) => {
    const categoria = despesa.category;
    if (!porCategoria[categoria]) {
      porCategoria[categoria] = {
        categoria,
        total: 0,
        quantidade: 0,
      };
    }
    porCategoria[categoria].total += despesa.amount;
    porCategoria[categoria].quantidade += 1;
    totalGeral += despesa.amount;
  });

  const relatorio = {
    tipo: 'monthly',
    ano: anoNum,
    mes: mesNum,
    totalGeral,
    porCategoria: Object.values(porCategoria),
  };

  return NextResponse.json(relatorio);
}

/**
 * Relatório anual: totais por mês
 */
async function relatorioAnual(userId, year) {
  const anoNum = parseInt(year, 10);
  const dataInicio = new Date(anoNum, 0, 1);
  const dataFim = new Date(anoNum, 11, 31, 23, 59, 59);

  // Buscar despesas do ano
  const despesas = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: dataInicio,
        lte: dataFim,
      },
    },
  });

  // Agregar por mês
  const porMes = Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    total: 0,
    quantidade: 0,
  }));

  let totalGeral = 0;

  despesas.forEach((despesa) => {
    const mesIndex = despesa.date.getMonth();
    porMes[mesIndex].total += despesa.amount;
    porMes[mesIndex].quantidade += 1;
    totalGeral += despesa.amount;
  });

  const relatorio = {
    tipo: 'yearly',
    ano: anoNum,
    totalGeral,
    porMes,
  };

  return NextResponse.json(relatorio);
}
