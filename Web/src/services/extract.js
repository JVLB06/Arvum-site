import api from './main';

function unwrapPayload(data, key) {
  return Array.isArray(data?.[key]) ? data[key] : [];
}

function normalizeReceipt(item) {
  return {
    id: item?.id,
    description: item?.description,
    minValue: item?.minValue,
    maxValue: item?.maxValue,
    paymentDate: item?.paymentDate,
    valor: item?.maxValue || 0,
  };
}

function normalizeInvestment(item) {
  return {
    id: item?.id,
    description: item?.description,
    value: item?.value,
    interest: item?.interest,
    initialDate: item?.initialDate,
    receiveDate: item?.receiveDate,
    receivedValue: item?.receivedValue,
    valor: item?.value || 0,
  };
}

function normalizeDebt(item) {
  return {
    id: item?.id,
    name: item?.name,
    value: item?.value,
    initialDate: item?.initialDate,
    receiveDate: item?.receiveDate,
    paid: item?.paid,
    valor: item?.value || 0,
  };
}

function normalizeGoal(item) {
  return {
    id: item?.id,
    description: item?.description,
    value: item?.value,
    goalDate: item?.goalDate,
    progress: item?.progress,
    valor: item?.value || 0,
  };
}

function normalizeExpense(item) {
  return {
    id: item?.id,
    description: item?.description,
    minValue: item?.minValue,
    maxValue: item?.maxValue,
    priority: item?.priority,
    dueDate: item?.dueDate,
    isFixed: item?.isFixed,
    valor: item?.maxValue || 0,
  };
}

const expenses = {
  getExtract: async (dateIni, dateEnd) => {
    const response = await api.get('/extrato/ler_extrato', {
      params: { InitialDate: dateIni, EndDate: dateEnd },
    });
    return response.data;
  },

  getRenda: async () => {
    const response = await api.get('/user_plan/ler_renda');
    const data = Array.isArray(response.data) ? response.data : response.data?.rendas || [];
    return data.map(normalizeReceipt);
  },

  getActiveInvestments: async () => {
    const response = await api.get('/user_plan/ler_investimentos_ativos');
    const data = Array.isArray(response.data) ? response.data : response.data?.invest || [];
    return data.map(normalizeInvestment);
  },

  getInactiveInvestments: async () => {
    const response = await api.get('/user_plan/ler_investimentos_encerrados');
    const data = Array.isArray(response.data) ? response.data : response.data?.invest || [];
    return data.map(normalizeInvestment);
  },

  getDebts: async () => {
    const response = await api.get('/user_plan/ler_dividas');
    const data = Array.isArray(response.data) ? response.data : response.data?.divida || [];
    return data.map(normalizeDebt);
  },

  getDivida: async () => {
    return this.getDebts();
  },

  getGastos: async () => {
    return this.getExpenses();
  },

  getMeta: async () => {
    return this.getGoals();
  },

  getInvestimento: async () => {
    return this.getActiveInvestments();
  },

  getGoals: async () => {
    const response = await api.get('/user_plan/ler_metas');
    const data = Array.isArray(response.data) ? response.data : response.data?.meta || [];
    return data.map(normalizeGoal);
  },

  getExpenses: async () => {
    const response = await api.get('/user_plan/ler_gastos');
    const data = Array.isArray(response.data) ? response.data : response.data?.gasto || [];
    return data.map(normalizeExpense);
  },

  // Esperado: { id?, name, value, extractDate, kind, balance, externalId? }
  createExpense: async (expenseData) => {
    const response = await api.post('/extrato/incluir_lancamento', expenseData);
    return response.data;
  },

  // Esperado: { id?, name, value, extractDate, kind, balance, externalId? }
  updateExpense: async (expenseData) => {
    const response = await api.put('/extrato/atualizar_lancamento', expenseData);
    return response.data;
  },

  // Esperado: { id, kind }
  deleteExpense: async (expenseData) => {
    const response = await api.delete('/extrato/remover_lancamento', {
      data: { id: expenseData.id, kind: expenseData.kind },
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