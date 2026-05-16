import { testModel } from '../../models/expertoTematico/testInicialModels.js';

export const testService = {
    async guardarNuevoTest(datosTest) {
        // Aquí podrías orquestar otras acciones, como registrar logs de IA
        // o validar que la competencia exista antes de insertar.
        
        return await testModel.insertarTest(datosTest);
    },

    async obtenerDetalleTest(testId) {
        console.log(`⚙️ [Service] Procesando lógica para el test: ${testId}`);
        
        const test = await testModel.obtenerTestPorId(testId);
        if (!test) throw new Error("El test solicitado no existe");

        // Añadimos una ponderación fija por defecto del 100% si no viene mapeada en la DB maestra
        test.ponderacion = test.ponderacion || 100; 

        return test;
    }
};