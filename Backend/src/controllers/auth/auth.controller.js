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