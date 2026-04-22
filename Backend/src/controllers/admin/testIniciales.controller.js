import { iaService } from '../../services/admin/testInicialesServices.js';

export const iaController = {
    obtenerProgramasConCompetencias: async (req, res) => {
        try {
            const programas = await iaService.listarProgramasYCompetencias();
            res.json(programas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerEstructuraCompletaCompetencia: async (req, res) => {
        try {
            const { id } = req.params;
            const estructura = await iaService.obtenerDetalleParaIA(id);
            res.json(estructura);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};