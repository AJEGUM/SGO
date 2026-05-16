import { testService } from '../../services/expertoTematico/testInicialService.js';

export const testController = {
    async crearTest(req, res) {
        try {
            const { competencia_id, nombre_test, descripcion, preguntas } = req.body;

            // Validación básica de parámetros requeridos
            if (!competencia_id || !nombre_test || !preguntas) {
                return res.status(400).json({ message: "Faltan campos obligatorios" });
            }

            const resultado = await testService.guardarNuevoTest({
                competencia_id,
                nombre_test,
                descripcion,
                preguntas
            });

            return res.status(201).json({
                message: "Test diagnóstico guardado exitosamente",
                testId: resultado.insertId
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error al guardar el test diagnóstico",
                error: error.message
            });
        }
    },

    async obtenerTest(req, res) {
        try {
            const { id } = req.params;
            console.log(`📌 [Controller] GET api/expertoTematico/ver-test/${id}`);

            if (!id) {
                return res.status(400).json({ message: "El ID del test es requerido" });
            }

            const test = await testService.obtenerDetalleTest(id);

            return res.status(200).json(test);
        } catch (error) {
            console.error("❌ [Controller] Error en obtenerTest:", error);
            return res.status(500).json({
                message: "Error al recuperar la previsualización del test",
                error: error.message
            });
        }
    }
};