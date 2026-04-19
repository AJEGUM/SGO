import { expertoService } from '../../services/expertoTematico/semillasService.js';

export const expertoController = {
    async listarMisSemillas(req, res) {
        try {
            const expertoId = req.user.id; 
            const semillas = await expertoService.obtenerSemillasVinculadas(expertoId);
            
            return res.status(200).json(semillas);
        } catch (error) {
            console.error("Error en expertoController.listarMisSemillas:", error);
            return res.status(500).json({ 
                message: "Error al obtener tus semillas vinculadas",
                error: error.message 
            });
        }
    }
};