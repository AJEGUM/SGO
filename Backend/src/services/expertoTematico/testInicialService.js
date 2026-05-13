import { testModel } from '../../models/expertoTematico/testInicialModels.js';

export const testService = {
    async guardarNuevoTest(datosTest) {
        // Aquí podrías orquestar otras acciones, como registrar logs de IA
        // o validar que la competencia exista antes de insertar.
        
        return await testModel.insertarTest(datosTest);
    }
};