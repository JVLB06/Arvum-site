import api from './main';

const userService = {
  // GET: Buscar todos
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // GET: Buscar por ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // POST: Criar novo usuário
  create: async (userData) => {
    const response = await api.post('/users', userData);
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

export default userService;