import api from './main';

function unwrapPayload(data, key) {
  return Array.isArray(data?.[key]) ? data[key] : [];
}

const cadastrate = {
  getRenda: async () => {
    const response = await api.get('/user_plan/ler_renda');
    return unwrapPayload(response.data, 'rendas');
  },

  createRenda: async (rendaData) => {
    const response = await api.post('/user_plan/criar_renda', rendaData);
    return response.data;
  },

  updateRenda: async (rendaData) => {
    const response = await api.put('/user_plan/atualizar_renda', rendaData);
    return response.data;
  },

  deleteRenda: async (deleteData) => {
    const response = await api.delete(`/user_plan/inativar_renda/${deleteData.id}`);
    return response.data;
  },

  getActiveInvestments: async () => {
    const response = await api.get('/user_plan/ler_investimentos_ativos');
    return unwrapPayload(response.data, 'invest');
  },

  getInactiveInvestments: async () => {
    const response = await api.get('/user_plan/ler_investimentos_encerrados');
    return unwrapPayload(response.data, 'invest');
  },

  createInvestment: async (investmentData) => {
    const response = await api.post('/user_plan/criar_investimento', investmentData);
    return response.data;
  },

  updateInvestment: async (investmentData) => {
    const response = await api.put('/user_plan/atualizar_investimento', investmentData);
    return response.data;
  },

  concludeInvestment: async (concludeData) => {
    const response = await api.put('/user_plan/concluir_investimento', concludeData);
    return response.data;
  },

  inactivateInvestment: async (inactivateData) => {
    const response = await api.delete(`/user_plan/inativar_investimento/${inactivateData.id}`);
    return response.data;
  },

  getDebts: async () => {
    const response = await api.get('/user_plan/ler_dividas');
    return unwrapPayload(response.data, 'divida');
  },

  createDebt: async (debtData) => {
    const response = await api.post('/user_plan/criar_divida', debtData);
    return response.data;
  },

  updateDebt: async (debtData) => {
    const response = await api.put('/user_plan/atualizar_divida', debtData);
    return response.data;
  },

  inactivateDebt: async (inactivateData) => {
    const response = await api.delete(`/user_plan/inativar_divida/${inactivateData.id}`);
    return response.data;
  },

  payDebt: async (payData) => {
    const response = await api.put('/user_plan/pagar_divida', payData);
    return response.data;
  },

  getFinishedDebts: async () => {
    const response = await api.get('/user_plan/ler_dividas_quitadas');
    return unwrapPayload(response.data, 'divida');
  },

  getGoals: async () => {
    const response = await api.get('/user_plan/ler_metas');
    return unwrapPayload(response.data, 'meta');
  },

  createGoal: async (goalData) => {
    const response = await api.post('/user_plan/criar_meta', goalData);
    return response.data;
  },

  updateGoal: async (goalData) => {
    const response = await api.put('/user_plan/atualizar_meta', goalData);
    return response.data;
  },

  inactivateGoal: async (inactivateData) => {
    const response = await api.delete(`/user_plan/inativar_meta/${inactivateData.id}`);
    return response.data;
  },

  concludeGoal: async (concludeData) => {
    const response = await api.put('/user_plan/concluir_meta', concludeData);
    return response.data;
  },

  getFinishedGoals: async () => {
    const response = await api.get('/user_plan/ler_metas_concluidas');
    return unwrapPayload(response.data, 'meta');
  },

  getExpenses: async () => {
    const response = await api.get('/user_plan/ler_gastos');
    return unwrapPayload(response.data, 'gasto');
  },

  createExpense: async (expenseData) => {
    const response = await api.post('/user_plan/criar_gasto', expenseData);
    return response.data;
  },

  updateExpense: async (expenseData) => {
    const response = await api.put('/user_plan/atualizar_gasto', expenseData);
    return response.data;
  },

  inactivateExpense: async (inactivateData) => {
    const response = await api.delete(`/user_plan/inativar_gasto/${inactivateData.id}`);
    return response.data;
  },
};

export default cadastrate;