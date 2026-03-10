import api from './main';

const cadastrate = {
  // POST: Cadastrar usuário
  create: async (userData) => {
    const response = await api.post(`/contas/cadastrar`, userData);
    return response.data;
  }
};

export default cadastrate;