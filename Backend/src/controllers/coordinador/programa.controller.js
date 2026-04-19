import { programaService } from '../../services/coordinador/programaService.js';

export const programaController = {
    async listar(req, res) {
        try {
            const programas = await programaService.getSelectorProgramas();
            return res.status(200).json(programas);
        } catch (error) {
            return res.status(500).json({ message: "Error al listar programas", error: error.message });
        }
    },

    async detalleEstructura(req, res) {
        try {
            const { id } = req.params;
            const estructura = await programaService.getDetallePedagogico(id);
            return res.status(200).json(estructura);
        } catch (error) {
            console.error("Error en detalleEstructura:", error);
            return res.status(500).json({ message: "Error al obtener estructura pedagógica", error: error.message });
        }
    }
};