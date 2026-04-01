import { AuthModel } from '../../models/auth/authModel.js';

export const authServices = {
  async validarAccesoInvitacion(token) {
    const invitacion = await AuthModel.obtenerDetalleInvitacion(token);
    if (!invitacion) {
      throw new Error("Invitación no encontrada, expirada o ya utilizada");
    }
    return invitacion;
  },

  async procesarRegistroGoogle(tokenInvitacion, payloadGoogle) {
        const invitacion = await this.validarAccesoInvitacion(tokenInvitacion);

        if (payloadGoogle.email !== invitacion.correo) {
            throw new Error(`Inconsistencia de identidad: Invitación para ${invitacion.correo}, pero usaste ${payloadGoogle.email}`);
        }

        // Enviamos el payload completo al modelo para crear el usuario
        const registro = await AuthModel.finalizarProcesoInvitacion(tokenInvitacion, payloadGoogle);

        return {
            id: registro.usuarioId,
            email: payloadGoogle.email,
            nombre: payloadGoogle.name,
            rol: invitacion.nombre_rol
        };
    }
}