import api from './main';

const accounts = {
  // POST: Login do usuário
  login: async (userData) => {
    const response = await api.post('/contas/login', userData);
    return response.data;
  },

  // POST: Cadastrar usuário
  cadastrate: async (userData) => {
    const response = await api.post(`/contas/cadastrar`, userData);
    return response.data;
  },

  // GET: Validar conexão
  validate: async () => {
    const response = await api.get('/contas/verificar-conexao');
    return response.data;
  },



  // PUT: Atualizar usuário
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // DELETE: Remover usuário
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default accounts;