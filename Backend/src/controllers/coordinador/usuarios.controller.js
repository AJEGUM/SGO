import { CoordinadorService } from '../../services/coordinador/userService.js';

export const obtenerExpertos = async (req, res) => {
    try {
        console.log("[SGO-DEBUG] Generando reporte de carga académica...");
        
        const data = await CoordinadorService.obtenerExpertosAcademicos();
        
        console.log(`[SGO-DEBUG] Reporte generado para ${data.length} expertos.`);
        
        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error("[SGO-ERROR] Error en getReporteCargaExpertos:", error);
        res.status(500).json({ 
            ok: false, 
            msg: 'Error al procesar el reporte de expertos.' 
        });
    }
};