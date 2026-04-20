import { programaModel } from '../../models/coordinador/programasModels.js';

export const programaService = {
    async getSelectorProgramas() {
        const programas = await programaModel.listarProgramas();
        
        return programas.map(p => ({
            ...p,
            // Lógica: Debe tener RAPs y el conteo debe coincidir
            es_completo: p.total_raps_esperados > 0 && 
                         p.total_raps_esperados === p.raps_completados
        }));
    },

    async getDetallePedagogico(programaId) {
        const estructura = await programaModel.obtenerEstructuraCompleta(programaId);
        if (!estructura || estructura.length === 0) {
            throw new Error("El programa seleccionado no tiene competencias cargadas.");
        }
        return estructura;
    }
};