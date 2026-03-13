import api from './main';

const accounts = {
  // POST: Login do usuário
  login: async (userData) => {
    const response = await api.post('/contas/login', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // POST: Cadastrar usuário
  cadastrate: async (userData) => {
    const response = await api.post(`/contas/cadastrar`, userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirecionamento simples
  },

  // GET: Validar conexão
  validate: async () => {
    try {
      const response = await api.get('/contas/verificar-conexao');
      return response.data; // Retorna true ou os dados do user
    } catch {
      return false; // Token inválido ou expirado
    }
  },
};

export default accounts;