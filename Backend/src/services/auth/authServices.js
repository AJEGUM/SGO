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
    },

async loginConGoogle(payloadGoogle) {
    // 1. Extraemos AMBOS campos del payload que viene de Passport
    const { sub: googleId, email } = payloadGoogle; 
    
    // 2. Ahora el log funcionará correctamente
    console.log("--> INTENTO LOGIN SGO | ID:", googleId, "| EMAIL:", email);
    
    // 3. Buscamos en la DB
    const usuario = await AuthModel.buscarUsuarioPorGoogleId(googleId);

    if (!usuario) {
        throw new Error("USUARIO_NO_REGISTRADO");
    }

    if (!usuario.activo) {
        throw new Error("CUENTA_INACTIVA");
    }

    return {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol_id,
        email: usuario.correo
    };
}
}