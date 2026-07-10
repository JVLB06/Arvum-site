import api from './main';

function unwrapPayload(data, key) {
  return Array.isArray(data?.[key]) ? data[key] : [];
}

const cadastrate = {
  getRenda: async () => {
    const response = await api.get('/user_plan/ler_renda');
    return unwrapPayload(response.data, 'rendas');
  },

  // Esperado: { receiptId?, name, minValue, maxValue, paymentDate }
  createRenda: async (rendaData) => {
    const response = await api.post('/user_plan/criar_renda', rendaData);
    return response.data;
  },

  // Esperado: { receiptId?, name, minValue, maxValue, paymentDate }
  updateRenda: async (rendaData) => {
    const response = await api.put('/user_plan/atualizar_renda', rendaData);
    return response.data;
  },

  deleteRenda: async (deleteData) => {
    const response = await api.delete(`/user_plan/inativar_renda/${deleteData}`);
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

  // Esperado: { id, description, value, interest, initialDate }
  createInvestment: async (investmentData) => {
    const response = await api.post('/user_plan/criar_investimento', investmentData);
    return response.data;
  },

  // Esperado: { id, description, value, interest, initialDate }
  updateInvestment: async (investmentData) => {
    const response = await api.put('/user_plan/atualizar_investimento', investmentData);
    return response.data;
  },

  // Esperado: { id, receiveDate, receivedValue }
  concludeInvestment: async (concludeData) => {
    const response = await api.put('/user_plan/concluir_investimento', concludeData);
    return response.data;
  },

  inactivateInvestment: async (investimentoData) => {
    const response = await api.delete(`/user_plan/inativar_investimento/${investimentoData}`);
    return response.data;
  },

  getDebts: async () => {
    const response = await api.get('/user_plan/ler_dividas');
    return unwrapPayload(response.data, 'divida');
  },

  // Esperado: { id?, description, value, endDate, initDate }
  createDebt: async (debtData) => {
    const response = await api.post('/user_plan/criar_divida', debtData);
    return response.data;
  },

  // Esperado: { id?, description, value, endDate, initDate }
  updateDebt: async (debtData) => {
    const response = await api.put('/user_plan/atualizar_divida', debtData);
    return response.data;
  },

  inactivateDebt: async (dividaData) => {
    const response = await api.delete(`/user_plan/inativar_divida/${dividaData}`);
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

  // Esperado: { userId?, id?, description, value, goalDate, progress }
  createGoal: async (goalData) => {
    const response = await api.post('/user_plan/criar_meta', goalData);
    return response.data;
  },

  // Esperado: { userId?, id?, description, value, goalDate, progress }
  updateGoal: async (goalData) => {
    const response = await api.put('/user_plan/atualizar_meta', goalData);
    return response.data;
  },

  inactivateGoal: async (metaData) => {
    const response = await api.delete(`/user_plan/inativar_meta/${metaData}`);
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

  // Esperado: { userId?, id?, description, minValue, maxValue, priority, dueDate, isFixed }
  createExpense: async (expenseData) => {
    const response = await api.post('/user_plan/criar_gasto', expenseData);
    return response.data;
  },

  // Esperado: { userId?, id?, description, minValue, maxValue, priority, dueDate, isFixed }
  updateExpense: async (expenseData) => {
    const response = await api.put('/user_plan/atualizar_gasto', expenseData);
    return response.data;
  },

  inactivateExpense: async (gastoData) => {
    const response = await api.delete(`/user_plan/inativar_gasto/${gastoData}`);
    return response.data;
  },
};

export default cadastrate;