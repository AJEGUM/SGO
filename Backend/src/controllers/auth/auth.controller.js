import { verificarGoogleToken } from '../../config/google.js';
import { authServices } from '../../services/auth/authServices.js'; // O muévelo a un service de auth si prefieres

export const verificarToken = async (req, res) => {
    try {
        const { token } = req.params;
        console.log("BUSCANDO TOKEN:", token); // Verifica que llegue completo
        
        // Llamamos al servicio
        const invitacion = await authServices.validarAccesoInvitacion(token);
        console.log("RESULTADO DB:", invitacion); // Si sale null, la query no encontró nada

        res.status(200).json({
            ok: true,
            data: invitacion
        });
    } catch (error) {
        console.error("Error validando token:", error.message);
        res.status(404).json({
            ok: false,
            msg: error.message || "Error al validar el acceso"
        });
    }
};

export const completarRegistroConGoogle = async (req, res) => {
    try {
        const { tokenGoogle, tokenInvitacion } = req.body;

        // 1. Validar identidad con Google
        const payload = await verificarGoogleToken(tokenGoogle);
        if (!payload) {
            return res.status(401).json({ ok: false, msg: 'Token de Google inválido o expirado' });
        }

        // 2. Usar el servicio para obtener la invitación y comparar
        // Pasamos el email de Google para que el servicio haga el "Filtro de Hierro"
        const resultado = await authServices.procesarRegistroGoogle(tokenInvitacion, payload);

        res.status(200).json({
            ok: true,
            msg: 'Registro completado con éxito',
            data: resultado
        });
    } catch (error) {
        console.error("Error en completarRegistroConGoogle:", error.message);
        // Si el error es por correos diferentes, mandamos 403
        const statusCode = error.message.includes("identidad") ? 403 : 400;
        res.status(statusCode).json({
            ok: false,
            msg: error.message
        });
    }
};