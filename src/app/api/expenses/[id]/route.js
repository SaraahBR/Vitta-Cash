// CRUD de despesa individual: GET, PUT, DELETE

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';
import { validarDespesa, sanitizarDadosDespesa } from '../../../../lib/validacoes';

/**
 * GET /api/expenses/:id - Busca despesa por ID
 */
export async function GET(request, { params }) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao?.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  const userId = sessao.user.id;
  const { id } = params;

  try {
    const despesa = await prisma.expense.findFirst({
      where: {
        id,
        userId, // SEGURANÇA: garantir que apenas o dono pode ver
      },
    });

    if (!despesa) {
      return NextResponse.json({ erro: 'Despesa não encontrada' }, { status: 404 });
    }

    return NextResponse.json(despesa);
  } catch (error_) {
    console.error('Erro ao buscar despesa:', error_);
    return NextResponse.json({ erro: 'Erro ao buscar despesa' }, { status: 500 });
  }
}

/**
 * PUT /api/expenses/:id - Atualiza despesa
 */
export async function PUT(request, { params }) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao?.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  const userId = sessao.user.id;
  const { id } = params;

  try {
    // Verificar se despesa existe e pertence ao usuário
    const despesaExistente = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!despesaExistente) {
      return NextResponse.json({ erro: 'Despesa não encontrada ou sem permissão' }, { status: 404 });
    }

    // Validar novos dados
    const dadosEntrada = await request.json();
    
    // Normalizar campos: aceitar português ou inglês
    const dadosNormalizados = {
      descricao: dadosEntrada.descricao || dadosEntrada.title,
      valor: dadosEntrada.valor ?? dadosEntrada.amount,
      data: dadosEntrada.data || dadosEntrada.date,
      categoria: dadosEntrada.categoria || dadosEntrada.category,
      recorrente: dadosEntrada.recorrente ?? dadosEntrada.recurring,
      tipoRecorrencia: dadosEntrada.tipoRecorrencia || dadosEntrada.recurrenceType,
      notas: dadosEntrada.notas ?? dadosEntrada.notes,
    };
    
    const { valido, erros } = validarDespesa(dadosNormalizados);
    
    if (!valido) {
      return NextResponse.json({ erro: 'Dados inválidos', detalhes: erros }, { status: 400 });
    }

    const dadosLimpos = sanitizarDadosDespesa(dadosNormalizados);

    // Atualizar despesa (converter para campos em inglês do banco)
    const despesaAtualizada = await prisma.expense.update({
      where: { id },
      data: {
        title: dadosLimpos.descricao,
        amount: dadosLimpos.valor,
        date: dadosLimpos.data,
        category: dadosLimpos.categoria,
        recurring: dadosLimpos.recorrente,
        recurrenceType: dadosLimpos.tipoRecorrencia,
        notes: dadosLimpos.notas,
      },
    });

    return NextResponse.json(despesaAtualizada);
  } catch (error_) {
    console.error('Erro ao atualizar despesa:', error_);
    return NextResponse.json({ erro: 'Erro ao atualizar despesa' }, { status: 500 });
  }
}

/**
 * DELETE /api/expenses/:id - Remove despesa
 */
export async function DELETE(request, { params }) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao?.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  const userId = sessao.user.id;
  const { id } = params;

  try {
    // Verificar propriedade antes de deletar
    const despesaExistente = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!despesaExistente) {
      return NextResponse.json({ erro: 'Despesa não encontrada ou sem permissão' }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ mensagem: 'Despesa removida com sucesso' });
  } catch (error_) {
    console.error('Erro ao deletar despesa:', error_);
    return NextResponse.json({ erro: 'Erro ao deletar despesa' }, { status: 500 });
  }
}
