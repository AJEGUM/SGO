import { programaModel } from '../../models/coordinador/programasModels.js';

export const programaService = {
    async getSelectorProgramas() {
        return await programaModel.listarProgramas();
    },

    async getDetallePedagogico(programaId) {
        const estructura = await programaModel.obtenerEstructuraCompleta(programaId);
        if (!estructura || estructura.length === 0) {
            throw new Error("El programa seleccionado no tiene competencias cargadas.");
        }
        return estructura;
    }
};