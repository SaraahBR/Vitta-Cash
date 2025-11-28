//
// CRUD de despesas: GET (listar/filtrar) e POST (criar)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';
import { validarDespesa, sanitizarDadosDespesa } from '../../../lib/validacoes';

/**
 * GET /api/expenses - Lista despesas com filtros opcionais
 * Query params: month, year, from, to, category
 */
export async function GET(request) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao?.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  const userId = sessao.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const category = searchParams.get('category');

    // Construir filtros dinâmicos
    const filtros = { userId };

    // Filtro por mês e ano
    if (month && year) {
      const mesNum = Number.parseInt(month, 10);
      const anoNum = Number.parseInt(year, 10);
      
      if (mesNum >= 1 && mesNum <= 12 && anoNum > 1900) {
        const dataInicio = new Date(anoNum, mesNum - 1, 1);
        const dataFim = new Date(anoNum, mesNum, 0, 23, 59, 59);
        
        filtros.date = {
          gte: dataInicio,
          lte: dataFim,
        };
      }
    } 
    // Filtro por range de datas (from/to)
    else if (from || to) {
      filtros.date = {};
      if (from) {
        filtros.date.gte = new Date(from);
      }
      if (to) {
        filtros.date.lte = new Date(to);
      }
    }

    // Filtro por categoria
    if (category) {
      filtros.category = category;
    }

    const despesas = await prisma.expense.findMany({
      where: filtros,
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(despesas);
  } catch (error_) {
    console.error('Erro ao listar despesas:', error_);
    return NextResponse.json({ erro: 'Erro ao buscar despesas' }, { status: 500 });
  }
}

/**
 * POST /api/expenses - Cria nova despesa
 * Body: { descricao, valor, data, categoria, recorrente, tipoRecorrencia, notas } (português)
 *    OU { title, amount, date, category, recurring, recurrenceType, notes } (inglês - retrocompatibilidade)
 */
export async function POST(request) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao?.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  const userId = sessao.user.id;

  try {
    const dadosEntrada = await request.json();

    // Normalizar campos: aceitar português ou inglês
    const dadosNormalizados = {
      descricao: dadosEntrada.descricao || dadosEntrada.title,
      valor: dadosEntrada.valor ?? dadosEntrada.amount,
      data: dadosEntrada.data || dadosEntrada.date,
      categoria: dadosEntrada.categoria || dadosEntrada.category,
      recorrente: dadosEntrada.recorrente ?? dadosEntrada.recurring ?? false,
      tipoRecorrencia: dadosEntrada.tipoRecorrencia || dadosEntrada.recurrenceType || 'NONE',
      notas: dadosEntrada.notas ?? dadosEntrada.notes ?? null,
    };

    // Validar dados
    const { valido, erros } = validarDespesa(dadosNormalizados);
    if (!valido) {
      return NextResponse.json({ erro: 'Dados inválidos', detalhes: erros }, { status: 400 });
    }

    // Sanitizar e preparar dados para o banco (que usa campos em inglês)
    const dadosLimpos = sanitizarDadosDespesa(dadosNormalizados);

    // Criar despesa no banco
    const novaDespesa = await prisma.expense.create({
      data: {
        title: dadosLimpos.descricao,
        amount: dadosLimpos.valor,
        date: dadosLimpos.data,
        category: dadosLimpos.categoria,
        recurring: dadosLimpos.recorrente,
        recurrenceType: dadosLimpos.tipoRecorrencia,
        notes: dadosLimpos.notas,
        userId,
      },
    });

    return NextResponse.json(novaDespesa, { status: 201 });
  } catch (error_) {
    console.error('Erro ao criar despesa:', error_);
    return NextResponse.json({ erro: 'Erro ao criar despesa' }, { status: 500 });
  }
}
