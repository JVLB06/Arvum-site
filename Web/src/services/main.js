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

api.interceptors.response.use(
  (response) => response, // Se der certo (200, 201...), não faz nada
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Remove o token vencido
      window.location.href = '/login';   // Expulsa o usuário
    }
    return Promise.reject(error);
  }
);

export default api;