import api from './main';

const expenses = {
    createExpense: async (expenseData) => {
        const response = await api.post(`/extrato/incluir_lancamento`, expenseData);
        return response.data;
    },

    updateExpense: async (expenseData) => {
        const response = await api.put(`/extrato/atualizar_lancamento`, expenseData);
        return response.data;
    },

    deleteExpense: async (expenseData) => {
        const response = await api.delete(`/extrato/remover_lancamento`, expenseData);
        return response.data;
    },

    obtainGoalPayments: async () => {
        const response = await api.get(`/extrato/obter_meta_pgto`);
        return response.data;
    },

    obtainExpensePayments: async () => {
        const response = await api.get(`/extrato/obter_gastos_pgto`);
        return response.data;
    },

    obtainDebtPayments: async () => {
        const response = await api.get(`/extrato/obter_divida_pgto`);
        return response.data;
    },

    obtainReceiptPayments: async () => {
        const response = await api.get(`/extrato/obter_renda_pgto`);
        return response.data;
    },

    obtainInvestmentPayments: async () => {
        const response = await api.get(`/extrato/obter_investimento_pgto`);
        return response.data;
    }
};

export default expenses;