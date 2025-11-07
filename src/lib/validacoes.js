/**
 * Valida dados de despesa
 * @param {Object} dados - Objeto com dados da despesa
 * @returns {Object} { valido: boolean, erros: string[] }
 */
export function validarDespesa(dados) {
  const erros = [];

  // Validar título
  if (!dados.title || typeof dados.title !== 'string' || dados.title.trim().length === 0) {
    erros.push('Título é obrigatório');
  } else if (dados.title.length > 200) {
    erros.push('Título deve ter no máximo 200 caracteres');
  }

  // Validar valor
  if (dados.amount === undefined || dados.amount === null) {
    erros.push('Valor é obrigatório');
  } else {
    const valorNumerico = parseFloat(dados.amount);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      erros.push('Valor deve ser um número positivo');
    }
  }

  // Validar data
  if (!dados.date) {
    erros.push('Data é obrigatória');
  } else {
    const dataObj = new Date(dados.date);
    if (isNaN(dataObj.getTime())) {
      erros.push('Data inválida');
    }
  }

  // Validar categoria
  if (!dados.category || typeof dados.category !== 'string' || dados.category.trim().length === 0) {
    erros.push('Categoria é obrigatória');
  }

  // Validar recorrência
  if (dados.recurring !== undefined && typeof dados.recurring !== 'boolean') {
    erros.push('Campo "recurring" deve ser booleano');
  }

  // Validar tipo de recorrência
  const tiposValidos = ['NONE', 'MONTHLY', 'YEARLY'];
  if (dados.recurrenceType && !tiposValidos.includes(dados.recurrenceType)) {
    erros.push('Tipo de recorrência inválido (deve ser NONE, MONTHLY ou YEARLY)');
  }

  // Validar notas (opcional)
  if (dados.notes && typeof dados.notes !== 'string') {
    erros.push('Notas devem ser texto');
  } else if (dados.notes && dados.notes.length > 1000) {
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
    title: dados.title?.trim(),
    amount: parseFloat(dados.amount),
    date: new Date(dados.date),
    category: dados.category?.trim(),
    recurring: Boolean(dados.recurring),
    recurrenceType: dados.recurrenceType || 'NONE',
    notes: dados.notes?.trim() || null,
  };
}
