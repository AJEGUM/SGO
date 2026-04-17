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
      // Como DevOps, aquí podrías diferenciar errores de cliente vs servidor
      const status = error.message.includes("Estructura") ? 400 : 500;
      return res.status(status).json({ message: error.message });
    }
  }
};