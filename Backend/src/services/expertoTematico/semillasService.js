import { expertoModel } from '../../models/expertoTematico/semillasModels.js';

export const expertoService = {
    async obtenerSemillasVinculadas(expertoId) {
        // Podríamos filtrar o transformar datos aquí antes de enviarlos al controller
        return await expertoModel.obtenerSemillasPorExperto(expertoId);
    }
};