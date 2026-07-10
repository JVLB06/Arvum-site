import api from './main';

const accounts = {
  // POST: Login do usuário
  // Esperado: { username, password }
  login: async (userData) => {
    const response = await api.post('/contas/login', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  // POST: Cadastrar usuário
  // Esperado: { userName, password, birthDate, email }
  cadastrate: async (userData) => {
    const response = await api.post(`/contas/cadastro`, userData);
    return response.data;
  },

  //Remover token e redirecionar para login
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirecionamento simples
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