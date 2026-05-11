import api from './main';

const think = {
    getMeasures: () => {
        return api.get('/thinking/indicadores');
    },

    createPreferences: (data) => {
        return api.post('/thinking/criar_preferencias', data);
    },

    updatePreferences: (data) => {
        return api.put('/thinking/atualizar_preferencias', data);
    },

    getPreferences: () => {
        return api.get('/thinking/ler_preferencias');
    }
};

export default think;