import model from '../../config/gemini.js';
import { EvaluacionModel } from '../../models/admin/testInicialModel.js';
import { getPromptEvaluacionSena } from '../../prompts/testInicialPrompt.js';

export const IAService = {
    async generarEvaluacionSENA(config) {
        const { competenciaId } = config;

        // 1. RAG: Traer contexto real de la DB
        const contexto = await EvaluacionModel.getContextoCurricular(competenciaId);

        // 2. Construir el Prompt
        const prompt = getPromptEvaluacionSena(config, contexto);

        // 3. Invocar a Gemini
        const result = await model.generateContent(prompt);
        const jsonTest = JSON.parse(result.response.text());

        // Retornamos SOLO el test generado para que el Admin lo vea en el Front
        return { test: jsonTest };
    },
    
    async guardarRevisionManual(datos) {
        // Verificamos si ya existe un registro para esa ficha y competencia
        const evaluacionExistente = await EvaluacionModel.buscarPorFichaYCompetencia(datos.fichaId, datos.competenciaId);

        let id;
        let mensaje;

        if (evaluacionExistente) {
            // Si existe, actualizamos el JSON y lo activamos
            await EvaluacionModel.actualizarTest(evaluacionExistente.id, {
                jsonTest: datos.jsonTest,
                adminId: datos.adminId,
                anotaciones: datos.anotaciones
            });
            id = evaluacionExistente.id;
            mensaje = "Evaluación actualizada y publicada exitosamente";
        } else {
            // Si no existe, creamos el registro desde cero
            id = await EvaluacionModel.guardarTestFinal(datos);
            mensaje = "Evaluación creada y publicada exitosamente";
        }

        return { id, message: mensaje };
    }
};