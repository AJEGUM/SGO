import { usuarioService } from '../../services/admin/usuariosService.js';

export const usuarioController = {
  // Para llenar la tabla principal
  async listarUsuarios(req, res) {
    try {
      const usuarios = await usuarioService.listarUsuarios();
      
      return res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error en usuarioController.listarUsuarios:", error);
      return res.status(500).json({ 
        message: "Error al obtener la lista de usuarios",
        error: error.message 
      });
    }
  },

  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { activo } = req.body; // El frontend envía { activo: true/false }

      await usuarioService.actualizarEstadoDirecto(id, activo);
      
      return res.status(200).json({ 
        message: `Estado actualizado correctamente`,
        id,
        activo 
      });
    } catch (error) {
      console.error("Error en cambiarEstado:", error);
      return res.status(500).json({ message: "Error al cambiar el estado" });
    }
  }
};