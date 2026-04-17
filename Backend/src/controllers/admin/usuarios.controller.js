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
  }
};