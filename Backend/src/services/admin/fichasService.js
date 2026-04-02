import { fichasModel } from '../../models/admin/fichasModel.js';

export const fichasService = {
    async nuevaFicha(numero, programaId, inicio, fin) {
        if (!numero || !programaId) throw new Error("Datos incompletos");
        return await fichasModel.insertar(numero, programaId, inicio, fin);
    },

    async listarTodas() {
        return await fichasModel.listar();
    },

    async listarPorPrograma(programaId) {
        return await fichasModel.filtrarPorPrograma(programaId);
    },
    
    async validarTest(fichaId, competenciaId) {
        return await fichasModel.verificarExistencia(fichaId, competenciaId);
    }
};