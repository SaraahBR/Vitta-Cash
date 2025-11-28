/**
 * Valida dados de despesa
 * @param {Object} dados - Objeto com dados da despesa
 * @returns {Object} { valido: boolean, erros: string[] }
 */
export function validarDespesa(dados) {
  const erros = [];

  // Validar descrição
  if (!dados.descricao || typeof dados.descricao !== 'string' || dados.descricao.trim().length === 0) {
    erros.push('Descrição é obrigatória');
  } else if (dados.descricao.length < 3) {
    erros.push('Descrição deve ter no mínimo 3 caracteres');
  } else if (dados.descricao.length > 255) {
    erros.push('Descrição deve ter no máximo 255 caracteres');
  }

  // Validar valor
  if (dados.valor === undefined || dados.valor === null) {
    erros.push('Valor é obrigatório');
  } else {
    const valorNumerico = Number.parseFloat(dados.valor);
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      erros.push('Valor deve ser um número positivo');
    }
  }

  // Validar data
  if (dados.data) {
    const dataObj = new Date(dados.data);
    if (Number.isNaN(dataObj.getTime())) {
      erros.push('Data inválida');
    }
  } else {
    erros.push('Data é obrigatória');
  }

  // Validar categoria
  if (!dados.categoria || typeof dados.categoria !== 'string' || dados.categoria.trim().length === 0) {
    erros.push('Categoria é obrigatória');
  }

  // Validar recorrência
  if (dados.recorrente !== undefined && typeof dados.recorrente !== 'boolean') {
    erros.push('Campo "recorrente" deve ser booleano');
  }

  // Validar tipo de recorrência
  const tiposValidos = ['NONE', 'MONTHLY', 'YEARLY'];
  if (dados.tipoRecorrencia && !tiposValidos.includes(dados.tipoRecorrencia)) {
    erros.push('Tipo de recorrência inválido (deve ser NONE, MONTHLY ou YEARLY)');
  }

  // Validar notas (opcional)
  if (dados.notas && typeof dados.notas !== 'string') {
    erros.push('Notas devem ser texto');
  } else if (dados.notas && dados.notas.length > 1000) {
    erros.push('Notas devem ter no máximo 1000 caracteres');
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

/**
 * Sanitiza dados de entrada da despesa
 * @param {Object} dados 
 * @returns {Object} Dados sanitizados
 */
export function sanitizarDadosDespesa(dados) {
  return {
    descricao: dados.descricao?.trim(),
    valor: Number.parseFloat(dados.valor),
    data: new Date(dados.data),
    categoria: dados.categoria?.trim(),
    recorrente: Boolean(dados.recorrente),
    tipoRecorrencia: dados.tipoRecorrencia || 'NONE',
    notas: dados.notas?.trim() || null,
  };
}
