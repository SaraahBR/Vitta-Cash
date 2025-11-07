//
// Importar despesas via CSV (multipart/form-data)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';
import { validarDespesa } from '../../../../lib/validacoes';

/**
 * POST /api/expenses/import
 * Body: FormData com arquivo CSV
 * 
 * NOTA: Para processar multipart/form-data, é necessário uma biblioteca como:
 * - formidable
 * - multer
 * - busboy
 * 
 * Este exemplo usa formidable. Instale com: npm install formidable
 */
export async function POST(request) {
  const sessao = await getServerSession(authOptions);
  
  if (!sessao || !sessao.user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const arquivo = formData.get('file');
    
    if (!arquivo) {
      return NextResponse.json({ erro: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Ler conteúdo do CSV
    const csvConteudo = await arquivo.text();
    
    // Parsear CSV (implementação simples, sem biblioteca externa)
    const linhas = csvConteudo.split('\n').filter((l) => l.trim());
    const cabecalho = linhas[0];
    const dadosLinhas = linhas.slice(1);

    const despesasParaCriar = [];
    const errosImportacao = [];

    dadosLinhas.forEach((linha, index) => {
      try {
        // Parse simples (pode melhorar com biblioteca CSV)
        const colunas = linha.split(',').map((col) => col.trim().replace(/^"|"$/g, ''));
        
        const despesa = {
          title: colunas[1],
          amount: parseFloat(colunas[2]),
          date: colunas[3],
          category: colunas[4],
          recurring: colunas[5] === 'Sim',
          recurrenceType: colunas[6] || 'NONE',
          notes: colunas[7] || null,
        };

        // Validar
        const { valido, erros } = validarDespesa(despesa);
        if (!valido) {
          errosImportacao.push({ linha: index + 2, erros });
        } else {
          despesasParaCriar.push({
            ...despesa,
            date: new Date(despesa.date),
            userId: sessao.user.id,
          });
        }
      } catch (erro) {
        errosImportacao.push({ linha: index + 2, erro: erro.message });
      }
    });

    // Criar despesas válidas
    if (despesasParaCriar.length > 0) {
      await prisma.expense.createMany({
        data: despesasParaCriar,
      });
    }

    return NextResponse.json({
      sucesso: true,
      importadas: despesasParaCriar.length,
      erros: errosImportacao,
    });
  } catch (erro) {
    console.error('Erro ao importar CSV:', erro);
    return NextResponse.json({ erro: 'Erro ao importar despesas' }, { status: 500 });
  }
}
