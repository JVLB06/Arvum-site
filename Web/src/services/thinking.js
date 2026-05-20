import api from './main';

const think = {
    getMeasures: () => {
        return api.get('/thinking/indicadores');
    },

    createPreferences: (data) => {
        return api.post('/thinking/criar_preferencias', data);
    },

    getPreferences: () => {
        return api.get('/thinking/ler_preferencias');
    },

    deletePreferences: () => {
        return api.delete('/thinking/deletar_preferencia/', {
            params: {
                id: preferenciaId
            }
        });
    }
};

export default think;