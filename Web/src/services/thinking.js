import api from './main';

const think = {
    getMesures: (id) => {
        return api.get(`/thinking/indicadores/${id}`);
    },

    createPreferences: (data) => {
        return api.post('/thinking/criar_preferencias', data);
    },

    updatePreferences: (data) => {
        return api.post('/thinking/atualizar_preferencias', data);
    },

    getPreferences: (id) => {
        return api.get(`/thinking/ler_preferencias/${id}`);
    }
};

export default think;