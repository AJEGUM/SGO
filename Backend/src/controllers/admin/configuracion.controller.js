import { configuracionService } from "../../services/admin/configuracionService.js";

// controllers/admin/configuracion.controller.js
export const configuracionController = {
  async obtenerConfiguracion(req, res) {
    try {
      const { clave } = req.params;
      const valor = await configuracionService.obtenerValor(clave);
      return res.status(200).json({ data: valor });
    } catch (error) {
      return res.status(404).json({ mensaje: error.message });
    }
  },

  async actualizarConfiguracion(req, res) {
    try {
      const { clave } = req.params;
      const { valor } = req.body;
      const adminId = req.user.id;

      await configuracionService.guardarCambio(clave, valor, adminId);

      return res.status(200).json({ mensaje: `Configuración ${clave} actualizada.` });
    } catch (error) {
      console.error("Error en configuracionController:", error);
      return res.status(500).json({ mensaje: error.message });
    }
  }
};