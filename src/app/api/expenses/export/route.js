//
// Exportar despesas em formato CSV

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

/**
 * GET /api/expenses/export?month=11&year=2025
 * Retorna CSV com despesas filtradas
 */
export async function GET(request) {
  const sessao = await getServerSession(authOptions);
  
  if (!sessao || !sessao.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  try {
    const userId = sessao.user.id;
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Construir filtros
    const filtros = { userId };

    if (month && year) {
      const mesNum = parseInt(month, 10);
      const anoNum = parseInt(year, 10);
      
      const dataInicio = new Date(anoNum, mesNum - 1, 1);
      const dataFim = new Date(anoNum, mesNum, 0, 23, 59, 59);
      
      filtros.date = {
        gte: dataInicio,
        lte: dataFim,
      };
    }

    const despesas = await prisma.expense.findMany({
      where: filtros,
      orderBy: { date: 'desc' },
    });

    // Gerar CSV
    const csvLinhas = [
      'ID,Título,Valor,Data,Categoria,Recorrente,Tipo Recorrência,Notas',
    ];

    despesas.forEach((despesa) => {
      const linha = [
        despesa.id,
        `"${despesa.title.replace(/"/g, '""')}"`, // Escapar aspas
        despesa.amount,
        despesa.date.toISOString().split('T')[0],
        `"${despesa.category}"`,
        despesa.recurring ? 'Sim' : 'Não',
        despesa.recurrenceType,
        despesa.notes ? `"${despesa.notes.replace(/"/g, '""')}"` : '',
      ].join(',');
      
      csvLinhas.push(linha);
    });

    const csvConteudo = csvLinhas.join('\n');

    // Configurar headers para download
    return new NextResponse('\uFEFF' + csvConteudo, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="despesas-${year || 'todas'}-${month || 'todos'}.csv"`,
      },
    });
  } catch (erro) {
    console.error('Erro ao exportar CSV:', erro);
    return NextResponse.json({ erro: 'Erro ao exportar despesas' }, { status: 500 });
  }
}
