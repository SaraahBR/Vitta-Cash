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
  
  if (!sessao || !sessao.user) {
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
  } catch (erro) {
    console.error('Erro ao buscar despesa:', erro);
    return NextResponse.json({ erro: 'Erro ao buscar despesa' }, { status: 500 });
  }
}

/**
 * PUT /api/expenses/:id - Atualiza despesa
 */
export async function PUT(request, { params }) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao || !sessao.user) {
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
    const { valido, erros } = validarDespesa(dadosEntrada);
    
    if (!valido) {
      return NextResponse.json({ erro: 'Dados inválidos', detalhes: erros }, { status: 400 });
    }

    const dadosLimpos = sanitizarDadosDespesa(dadosEntrada);

    // Atualizar despesa
    const despesaAtualizada = await prisma.expense.update({
      where: { id },
      data: dadosLimpos,
    });

    return NextResponse.json(despesaAtualizada);
  } catch (erro) {
    console.error('Erro ao atualizar despesa:', erro);
    return NextResponse.json({ erro: 'Erro ao atualizar despesa' }, { status: 500 });
  }
}

/**
 * DELETE /api/expenses/:id - Remove despesa
 */
export async function DELETE(request, { params }) {
  // Verificar autenticação
  const sessao = await getServerSession(authOptions);
  
  if (!sessao || !sessao.user) {
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
  } catch (erro) {
    console.error('Erro ao deletar despesa:', erro);
    return NextResponse.json({ erro: 'Erro ao deletar despesa' }, { status: 500 });
  }
}
