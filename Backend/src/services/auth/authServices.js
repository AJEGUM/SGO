import { AuthModel } from '../../models/auth/authModel.js'; // O muévelo a un service de auth si prefieres


export const authServices = {
  async validarAccesoInvitacion(token) {
    const invitacion = await AuthModel.obtenerDetalleInvitacion(token);
        
    if (!invitacion) {
      throw new Error("Invitación no encontrada, expirada o ya utilizada");
    }

    return invitacion;
  },
}