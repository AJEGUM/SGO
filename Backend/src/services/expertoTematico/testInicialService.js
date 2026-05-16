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
    },

    async actualizarExistente(testId, datosTest) {
        const { nombre_test, descripcion, preguntas } = datosTest;

        // Reconstruimos la estructura idéntica a como la guarda tu prompt de IA
        const payloadEstructurado = {
            preguntas: preguntas,
            descripcion: descripcion || 'Test inicial para el programa',
            nombre_test: nombre_test
        };

        // Convertimos el objeto estructurado a String para la columna JSON de la DB
        const preguntasJsonString = JSON.stringify(payloadEstructurado);

        // Orquestamos la llamada al modelo de datos
        return await testModel.actualizarTest(testId, {
            nombre_test,
            descripcion,
            preguntas_json: preguntasJsonString
        });
    }
};