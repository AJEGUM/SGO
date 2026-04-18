import { usuarioModel } from '../../models/login/loginModels.js';

export const authService = {
    procesarOAuthGoogle: async (profile) => {
        const correo = profile.emails[0].value;
        const googleId = profile.id;

        // 1. Verificar existencia
        const usuarioExistente = await usuarioModel.buscarPorCorreo(correo);

        if (usuarioExistente) {
            // Si existe pero no tiene el ID de Google vinculado, lo hacemos ahora
            if (!usuarioExistente.google_id) {
                await usuarioModel.vincularGoogle(usuarioExistente.id, googleId);
            }
            return usuarioExistente;
        }

        // 2. Si es nuevo, validar invitación
        const invitacion = await usuarioModel.obtenerInvitacionValida(correo);

        if (!invitacion) {
            throw new Error('No posees una invitación válida para este sistema.');
        }

        // 3. Crear usuario basado en los datos de la invitación y perfil de Google
        return await usuarioModel.crearDesdeInvitacion({
            rol_id: invitacion.rol_id,
            nombre: profile.displayName,
            correo: correo,
            googleId: googleId
        }, invitacion.invitacion_id);
    }
};