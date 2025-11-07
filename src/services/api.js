import axios from 'axios';

const TOKEN_KEY = 'vittacash_token';
const USER_KEY = 'vittacash_user';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://vittacash.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

export const authService = {
  login: async (googleIdToken) => {
    
    const response = await apiClient.post('/auth/login/google', { tokenGoogle: googleIdToken });
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
  const params = new URLSearchParams();
  if (filtros.month) params.append('month', filtros.month);
  if (filtros.year) params.append('year', filtros.year);
  if (filtros.category) params.append('category', filtros.category);
  if (filtros.from) params.append('from', filtros.from);
  if (filtros.to) params.append('to', filtros.to);
  const response = await apiClient.get(`/expenses?${params.toString()}`);
  return response.data;
};

export const criarDespesa = async (dados) => {
  const response = await apiClient.post('/expenses', dados);
  return response.data;
};

export const obterDespesa = async (id) => {
  const response = await apiClient.get(`/expenses/${id}`);
  return response.data;
};

export const atualizarDespesa = async (id, dados) => {
  const response = await apiClient.put(`/expenses/${id}`, dados);
  return response.data;
};

export const deletarDespesa = async (id) => {
  const response = await apiClient.delete(`/expenses/${id}`);
  return response.data;
};

export const excluirDespesa = deletarDespesa;

export const obterRelatorio = async (tipo, ano, mes = null) => {
  const params = new URLSearchParams({ type: tipo, year: ano });
  if (mes && tipo === 'monthly') params.append('month', mes);
  const response = await apiClient.get(`/expenses/report?${params.toString()}`);
  return response.data;
};

export const exportarDespesas = (mes, ano) => {
  const params = new URLSearchParams();
  if (mes) params.append('month', mes);
  if (ano) params.append('year', ano);
  const token = authService.getToken();
  const authParam = token ? `&token=${encodeURIComponent(token)}` : '';
  return `${apiClient.defaults.baseURL}/expenses/export?${params.toString()}${authParam}`;
};

export const importarDespesas = async (arquivo) => {
  const formData = new FormData();
  formData.append('file', arquivo);
  const response = await apiClient.post('/expenses/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default apiClient;
