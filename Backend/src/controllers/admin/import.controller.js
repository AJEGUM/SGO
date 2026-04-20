import { programModel } from '../../models/admin/importModels.js';
import { importService } from '../../services/admin/importService.js';

export const importController = {
  async importarReporte(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No hay archivo" });
      }

      const resultado = await importService.procesarFichaSena(req.file.buffer);

      return res.status(200).json({
        message: "Importación completada con éxito",
        detalle: resultado
      });

    } catch (error) {
      console.error("Error en importController:", error);
      const status = error.message.includes("Estructura") ? 400 : 500;
      return res.status(status).json({ message: error.message });
    }
  },

  async listar(req, res) {
    try {
      const programas = await importService.obtenerProgramas();
      return res.status(200).json(programas);
    } catch (error) {
      console.error("Error en programaController.listar:", error);
      return res.status(500).json({ mensaje: "Error al obtener programas" });
    }
  },

  async detalle(req, res) {
    try {
      const { id } = req.params;
      const programa = await importService.obtenerEstructuraPrograma(id);
      
      if (!programa) {
        return res.status(404).json({ mensaje: "Programa no encontrado" });
      }
      
      return res.status(200).json(programa);
    } catch (error) {
      console.error("Error en programaController.detalle:", error);
      return res.status(500).json({ mensaje: "Error al obtener el detalle" });
    }
  },

  async gestionarEstructuraRap(req, res) {
    try {
        const { rapId } = req.params;
        const payload = req.body;

        // Si el payload viene vacío o con una bandera de limpieza, delegamos al borrado
        // de lo contrario, procedemos a la actualización/guardado.
        const resultado = await importService.procesarActualizacionRap(rapId, payload);
        
        return res.status(200).json({
            message: resultado.action === 'deleted' 
                ? "Información curricular limpiada correctamente" 
                : "Estructura curricular actualizada correctamente",
            data: resultado
        });
    } catch (error) {
        console.error("Error en gestionarEstructuraRap:", error);
        const status = error.message.includes("obligatorio") ? 400 : 500;
        return res.status(status).json({ 
            message: "Error al gestionar la estructura del RAP", 
            error: error.message 
        });
    }
  }
};