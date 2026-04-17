import { invitacionService } from '../../services/admin/invitacionService.js';

export const invitacionController = {
  async invitarUsuario(req, res) {
    try {
      const { correo, confirmarCorreo, rol_id } = req.body;

      if (!correo || !confirmarCorreo || !rol_id) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      if (correo.toLowerCase() !== confirmarCorreo.toLowerCase()) {
        return res.status(400).json({ message: "Los correos electrónicos no coinciden" });
      }

      const resultado = await invitacionService.crearYEnviarInvitacion(correo.toLowerCase(), rol_id);
      
      return res.status(201).json({
        message: "Invitación enviada con éxito",
        detalle: resultado
      });

    } catch (error) {
      console.error("Error en invitacionController:", error);
      return res.status(500).json({ message: error.message });
    }
  },

  async obtenerRoles(req, res) {
    try {
      const roles = await invitacionService.listarRoles();
      return res.status(200).json(roles);
    } catch (error) {
      console.error("Error en obtenerRoles:", error);
      return res.status(500).json({ message: "Error al obtener los roles" });
    }
  }
};