import api from './main';

const think = {
    getMeasures: () => {
        return api.get('/thinking/indicadores');
    },

    // Esperado: { externalId, exclude, reduce, block }
    createPreferences: (data) => {
        return api.post('/thinking/criar_preferencias', data);
    },

    getPreferences: () => {
        return api.get('/thinking/ler_preferencias');
    },

    // Esperado: preferenciaId como parâmetro
    deletePreferences: (preferenciaId) => {
        return api.delete(`/thinking/deletar_preferencia/${preferenciaId}`);
    }
};

export default think;