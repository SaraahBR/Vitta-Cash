/**
 * Formata valor monetário para exibição (brasileiro)
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado (ex: "1.234,56")
 */
export function formatarValorBRL(valor) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return '0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formata valor monetário completo com R$
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado com símbolo (ex: "R$ 1.234,56")
 */
export function formatarMoeda(valor) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Converte string formatada em número
 * @param {string} valorFormatado - Valor formatado (ex: "1.234,56")
 * @returns {number} Valor numérico
 */
export function desformatarValor(valorFormatado) {
  if (!valorFormatado) return 0;
  
  // Remove pontos (separador de milhar) e troca vírgula por ponto
  const valorLimpo = valorFormatado
    .replaceAll('.', '')
    .replace(',', '.');
  
  return Number.parseFloat(valorLimpo) || 0;
}

/**
 * Formata valor enquanto o usuário digita
 * @param {string} valor - Valor digitado
 * @returns {string} Valor formatado para input
 */
export function formatarValorInput(valor) {
  // Remove tudo que não é número
  const numeros = valor.replaceAll(/\D/g, '');
  
  // Se vazio, retorna vazio
  if (!numeros) return '';
  
  // Converte para número e divide por 100 (para ter os centavos)
  const valorNumerico = Number.parseFloat(numeros) / 100;
  
  // Formata com separador de milhar e vírgula
  return formatarValorBRL(valorNumerico);
}

/**
 * Formata data corrigindo problema de timezone
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data formatada em pt-BR (ex: "01/11/2025")
 */
export function formatarData(data) {
  if (!data) return '';
  
  const dataObj = new Date(data);
  
  // Corrigir timezone adicionando o offset
  const offset = dataObj.getTimezoneOffset();
  const dataCorrigida = new Date(dataObj.getTime() + offset * 60 * 1000);
  
  return dataCorrigida.toLocaleDateString('pt-BR');
}

/**
 * Converte data do input (YYYY-MM-DD) para ISO sem problema de timezone
 * @param {string} dataInput - Data no formato YYYY-MM-DD
 * @returns {string} Data em formato ISO
 */
export function converterDataParaISO(dataInput) {
  if (!dataInput) return new Date().toISOString();
  
  const [ano, mes, dia] = dataInput.split('-');
  // Criar data no meio-dia para evitar problemas de timezone
  const data = new Date(ano, mes - 1, dia, 12, 0, 0);
  
  return data.toISOString();
}
