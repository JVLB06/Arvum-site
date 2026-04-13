import api from './main';

function unwrapPayload(data, key) {
  return Array.isArray(data?.[key]) ? data[key] : [];
}

const expenses = {
  createExpense: async (expenseData) => {
    const response = await api.post('/extrato/incluir_lancamento', expenseData);
    return response.data;
  },

  updateExpense: async (expenseData) => {
    const response = await api.put('/extrato/atualizar_lancamento', expenseData);
    return response.data;
  },

  deleteExpense: async (expenseData) => {
    const response = await api.delete('/extrato/remover_lancamento', {
      data: expenseData,
    });
    return response.data;
  },

  obtainGoalPayments: async () => {
    const response = await api.get('/extrato/obter_meta_pgto');
    return unwrapPayload(response.data, 'meta');
  },

  obtainExpensePayments: async () => {
    const response = await api.get('/extrato/obter_gastos_pgto');
    return unwrapPayload(response.data, 'gastos');
  },

  obtainDebtPayments: async () => {
    const response = await api.get('/extrato/obter_divida_pgto');
    return unwrapPayload(response.data, 'dividas');
  },

  obtainReceiptPayments: async () => {
    const response = await api.get('/extrato/obter_renda_pgto');
    return unwrapPayload(response.data, 'rendas');
  },

  obtainInvestmentPayments: async () => {
    const response = await api.get('/extrato/obter_investimento_pgto');
    return unwrapPayload(response.data, 'investimentos');
  },
};

export default expenses;