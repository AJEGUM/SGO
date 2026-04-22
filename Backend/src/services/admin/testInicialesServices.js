import { iaModel } from '../../models/admin/testInicialModel.js';

export const iaService = {
    listarProgramasYCompetencias: async () => {
        // Obtenemos los programas y sus competencias asociadas
        return await iaModel.getProgramasWithCompetencias();
    },

    obtenerDetalleParaIA: async (competenciaId) => {
        // Traemos toda la "carne" de la competencia: RAPs, Saber, Proceso y Criterios
        // Esto es vital para que el prompt de la IA sea preciso
        const raps = await iaModel.getEstructuraPedagogica(competenciaId);
        
        return {
            competenciaId,
            totalRaps: raps.length,
            estructura: raps
        };
    }
};