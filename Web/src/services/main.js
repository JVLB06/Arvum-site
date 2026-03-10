import axios from 'axios';

const api = axios.create({
  baseURL: 'https://136.248.106.107:5000', // Altere para a sua URL
  headers: {
    'Content-Type': 'application/json',
  }
});

// Exemplo de interceptor para injetar Token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;