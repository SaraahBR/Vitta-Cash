// pages/api/expenses/[id].js
// CRUD de despesa individual: GET, PUT, DELETE

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../src/lib/prisma';
import { validarDespesa, sanitizarDadosDespesa } from '../../../src/lib/validacoes';

/**
 * Handler para /api/expenses/:id
 * GET: buscar despesa por ID
 * PUT: atualizar despesa
 * DELETE: remover despesa
 */
export default async function handler(req, res) {
  // Verificar autenticação
  const sessao = await getServerSession(req, res, authOptions);
  
  if (!sessao || !sessao.user) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  const userId = sessao.user.id;
  const { id } = req.query;

  if (req.method === 'GET') {
    return await obterDespesa(req, res, id, userId);
  } else if (req.method === 'PUT') {
    return await atualizarDespesa(req, res, id, userId);
  } else if (req.method === 'DELETE') {
    return await deletarDespesa(req, res, id, userId);
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ erro: `Método ${req.method} não permitido` });
  }
}

/**
 * GET /api/expenses/:id - Busca despesa por ID
 */
async function obterDespesa(req, res, id, userId) {
  try {
    const despesa = await prisma.expense.findFirst({
      where: {
        id,
        userId, // SEGURANÇA: garantir que apenas o dono pode ver
      },
    });

    if (!despesa) {
      return res.status(404).json({ erro: 'Despesa não encontrada' });
    }

    return res.status(200).json(despesa);
  } catch (erro) {
    console.error('Erro ao buscar despesa:', erro);
    return res.status(500).json({ erro: 'Erro ao buscar despesa' });
  }
}

/**
 * PUT /api/expenses/:id - Atualiza despesa
 */
async function atualizarDespesa(req, res, id, userId) {
  try {
    // Verificar se despesa existe e pertence ao usuário
    const despesaExistente = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!despesaExistente) {
      return res.status(404).json({ erro: 'Despesa não encontrada ou sem permissão' });
    }

    // Validar novos dados
    const dadosEntrada = req.body;
    const { valido, erros } = validarDespesa(dadosEntrada);
    
    if (!valido) {
      return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
    }

    const dadosLimpos = sanitizarDadosDespesa(dadosEntrada);

    // Atualizar despesa
    const despesaAtualizada = await prisma.expense.update({
      where: { id },
      data: dadosLimpos,
    });

    return res.status(200).json(despesaAtualizada);
  } catch (erro) {
    console.error('Erro ao atualizar despesa:', erro);
    return res.status(500).json({ erro: 'Erro ao atualizar despesa' });
  }
}

/**
 * DELETE /api/expenses/:id - Remove despesa
 */
async function deletarDespesa(req, res, id, userId) {
  try {
    // Verificar propriedade antes de deletar
    const despesaExistente = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!despesaExistente) {
      return res.status(404).json({ erro: 'Despesa não encontrada ou sem permissão' });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return res.status(200).json({ mensagem: 'Despesa removida com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar despesa:', erro);
    return res.status(500).json({ erro: 'Erro ao deletar despesa' });
  }
}
