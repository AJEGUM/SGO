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

  async guardarEstructura(req, res) {
    try {
        const { rapId } = req.params;
        const payload = req.body;
        
        const resultado = await importService.actualizarEstructuraRap(rapId, payload);
        
        return res.status(200).json({
            message: "Estructura curricular actualizada correctamente",
            data: resultado
        });
    } catch (error) {
        console.error("Error en guardarEstructura:", error);
        return res.status(500).json({ 
            message: "Error al guardar los detalles del RAP", 
            error: error.message 
        });
    }
  },

  async eliminarDetallesRap(req, res) {
    try {
        const { rapId } = req.params;

        // Llamada al Service siguiendo el protocolo SGO-Layered
        await importService.borrarEstructuraEspecificaRap(rapId);
        
        return res.status(200).json({
            message: "Conocimientos y criterios eliminados. El RAP ahora está limpio."
        });
    } catch (error) {
        console.error("Error al eliminar detalles en Controller:", error);
        
        // Si el error viene de la validación del service, podrías enviar un 400
        const statusCode = error.message.includes("ID del RAP") ? 400 : 500;
        
        return res.status(statusCode).json({ 
            message: error.message || "Error interno al intentar eliminar los detalles",
        });
    }
  }
};