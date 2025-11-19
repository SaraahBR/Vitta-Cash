import axios from 'axios';
import cacheGlobal, { TTL } from '../lib/cache';
import localCache from '../lib/localCache';

const TOKEN_KEY = 'vittacash_token';
const USER_KEY = 'vittacash_user';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vittacash.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000, // 2 minutos para permitir cold start do Render
});

export const authService = {
  login: async (googleIdToken) => {
    
    const response = await apiClient.post('/api/auth/login/google', { tokenGoogle: googleIdToken });
    const { token, usuario } = response.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    }
    return { token, usuario };
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/';
    }
  },
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  getUser: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },
  isAuthenticated: () => !!authService.getToken(),
};

/**
 * Busca com cache híbrido (memória + localStorage)
 */
const buscarComCacheHibrido = async (chave, funcaoBusca, ttlMemoria, ttlLocalMinutos = 30) => {
  // 1. Tenta cache em memória (mais rápido)
  const dadosMemoria = cacheGlobal.get(chave);
  if (dadosMemoria !== null) {
    return dadosMemoria;
  }

  // 2. Tenta localStorage (persiste entre sessões)
  const dadosLocal = localCache.get(chave);
  if (dadosLocal !== null) {
    // Salva também na memória para próximas buscas
    cacheGlobal.set(chave, dadosLocal, ttlMemoria);
    return dadosLocal;
  }

  // 3. Busca da API
  const dados = await funcaoBusca();

  // 4. Salva em ambos os caches
  cacheGlobal.set(chave, dados, ttlMemoria);
  localCache.set(chave, dados, ttlLocalMinutos);

  return dados;
};

apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) authService.logout();
    return Promise.reject(error);
  }
);

export const listarDespesas = async (filtros = {}) => {
  const chaveCache = cacheGlobal.gerarChave('despesas', filtros);
  
  return buscarComCacheHibrido(
    chaveCache,
    async () => {
      const params = new URLSearchParams();
      if (filtros.month) params.append('month', filtros.month);
      if (filtros.year) params.append('year', filtros.year);
      if (filtros.category) params.append('category', filtros.category);
      if (filtros.from) params.append('from', filtros.from);
      if (filtros.to) params.append('to', filtros.to);
      const response = await apiClient.get(`/api/expenses?${params.toString()}`);
      return response.data;
    },
    TTL.DESPESAS,
    10 // 10 minutos no localStorage
  );
};

export const criarDespesa = async (dados) => {
  const response = await apiClient.post('/api/expenses', dados);
  // Invalida cache de despesas e relatórios após criar (memória + localStorage)
  cacheGlobal.invalidarPorPrefixo('despesas');
  cacheGlobal.invalidarPorPrefixo('relatorio');
  localCache.removerPorPrefixo('despesas');
  localCache.removerPorPrefixo('relatorio');
  return response.data;
};

export const obterDespesa = async (id) => {
  const chaveCache = cacheGlobal.gerarChave('despesa', { id });
  
  return buscarComCacheHibrido(
    chaveCache,
    async () => {
      const response = await apiClient.get(`/api/expenses/${id}`);
      return response.data;
    },
    TTL.DESPESAS,
    15 // 15 minutos no localStorage
  );
};

export const atualizarDespesa = async (id, dados) => {
  const response = await apiClient.put(`/api/expenses/${id}`, dados);
  // Invalida cache desta despesa específica e listas (memória + localStorage)
  const chaveEspecifica = cacheGlobal.gerarChave('despesa', { id });
  cacheGlobal.invalidar(chaveEspecifica);
  localCache.remover(chaveEspecifica);
  cacheGlobal.invalidarPorPrefixo('despesas');
  cacheGlobal.invalidarPorPrefixo('relatorio');
  localCache.removerPorPrefixo('despesas');
  localCache.removerPorPrefixo('relatorio');
  return response.data;
};

export const deletarDespesa = async (id) => {
  const response = await apiClient.delete(`/api/expenses/${id}`);
  // Invalida cache desta despesa específica e listas (memória + localStorage)
  const chaveEspecifica = cacheGlobal.gerarChave('despesa', { id });
  cacheGlobal.invalidar(chaveEspecifica);
  localCache.remover(chaveEspecifica);
  cacheGlobal.invalidarPorPrefixo('despesas');
  cacheGlobal.invalidarPorPrefixo('relatorio');
  localCache.removerPorPrefixo('despesas');
  localCache.removerPorPrefixo('relatorio');
  return response.data;
};

export const excluirDespesa = deletarDespesa;

export const obterRelatorio = async (tipo, ano, mes = null) => {
  const chaveCache = cacheGlobal.gerarChave('relatorio', { tipo, ano, mes });
  
  return buscarComCacheHibrido(
    chaveCache,
    async () => {
      const params = new URLSearchParams({ type: tipo, year: ano });
      if (mes && tipo === 'monthly') params.append('month', mes);
      const response = await apiClient.get(`/api/expenses/report?${params.toString()}`);
      return response.data;
    },
    TTL.RELATORIOS,
    20 // 20 minutos no localStorage
  );
};

export const exportarDespesas = (mes, ano) => {
  const params = new URLSearchParams();
  if (mes) params.append('month', mes);
  if (ano) params.append('year', ano);
  const token = authService.getToken();
  const authParam = token ? `&token=${encodeURIComponent(token)}` : '';
  return `${apiClient.defaults.baseURL}/api/expenses/export?${params.toString()}${authParam}`;
};

export const importarDespesas = async (arquivo) => {
  const formData = new FormData();
  formData.append('file', arquivo);
  const response = await apiClient.post('/api/expenses/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default apiClient;
