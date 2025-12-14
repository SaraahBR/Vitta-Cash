/**
 * Valida descrição
 */
function validarDescricao(descricao) {
  if (!descricao || typeof descricao !== 'string' || descricao.trim().length === 0) {
    return 'Descrição é obrigatória';
  }
  if (descricao.length < 3) {
    return 'Descrição deve ter no mínimo 3 caracteres';
  }
  if (descricao.length > 255) {
    return 'Descrição deve ter no máximo 255 caracteres';
  }
  return null;
}

/**
 * Valida valor
 */
function validarValor(valor) {
  if (valor === undefined || valor === null) {
    return 'Valor é obrigatório';
  }
  const valorNumerico = Number.parseFloat(valor);
  if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
    return 'Valor deve ser um número positivo';
  }
  return null;
}

/**
 * Valida data
 */
function validarData(data) {
  if (!data) {
    return 'Data é obrigatória';
  }
  const dataObj = new Date(data);
  if (Number.isNaN(dataObj.getTime())) {
    return 'Data inválida';
  }
  return null;
}

/**
 * Valida categoria
 */
function validarCategoria(categoria) {
  if (!categoria || typeof categoria !== 'string' || categoria.trim().length === 0) {
    return 'Categoria é obrigatória';
  }
  return null;
}

/**
 * Valida recorrência
 */
function validarRecorrencia(recorrente, tipoRecorrencia) {
  const erros = [];
  
  if (recorrente !== undefined && typeof recorrente !== 'boolean') {
    erros.push('Campo "recorrente" deve ser booleano');
  }
  
  const tiposValidos = ['NONE', 'MONTHLY', 'YEARLY'];
  if (tipoRecorrencia && !tiposValidos.includes(tipoRecorrencia)) {
    erros.push('Tipo de recorrência inválido (deve ser NONE, MONTHLY ou YEARLY)');
  }
  
  return erros;
}

/**
 * Valida notas
 */
function validarNotas(notas) {
  if (notas && typeof notas !== 'string') {
    return 'Notas devem ser texto';
  }
  if (notas && notas.length > 1000) {
    return 'Notas devem ter no máximo 1000 caracteres';
  }
  return null;
}

/**
 * Valida dados de despesa
 * @param {Object} dados - Objeto com dados da despesa
 * @returns {Object} { valido: boolean, erros: string[] }
 */
export function validarDespesa(dados) {
  const erros = [];

  // Validar descrição
  const erroDescricao = validarDescricao(dados.descricao);
  if (erroDescricao) erros.push(erroDescricao);

  // Validar valor
  const erroValor = validarValor(dados.valor);
  if (erroValor) erros.push(erroValor);

  // Validar data
  const erroData = validarData(dados.data);
  if (erroData) erros.push(erroData);

  // Validar categoria
  const erroCategoria = validarCategoria(dados.categoria);
  if (erroCategoria) erros.push(erroCategoria);

  // Validar recorrência
  const errosRecorrencia = validarRecorrencia(dados.recorrente, dados.tipoRecorrencia);
  erros.push(...errosRecorrencia);

  // Validar notas (opcional)
  const erroNotas = validarNotas(dados.notas);
  if (erroNotas) erros.push(erroNotas);

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
