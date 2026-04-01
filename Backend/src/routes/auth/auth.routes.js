import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { verificarToken } from '../../controllers/auth/auth.controller.js';
import { validarTokenMiddleware } from '../../middlewares/validarTokenFormato.js';

const router = Router();

// Ruta de invitación (se queda igual para validar antes de mostrar el botón)
router.get('/verificar-invitacion/:token', validarTokenMiddleware, verificarToken);

// --- FLUJO PASSPORT ---

// 1. Iniciar Auth (Si viene de invitación, el front debe enviar ?token=...)
router.get('/google', (req, res, next) => {
    console.log("--> INICIANDO FLUJO GOOGLE");
    const { token } = req.query;
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state: token // Guardamos el token de invitación aquí para recuperarlo en el callback
    })(req, res, next);
});

// 2. Callback de Google
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
        const tokenInvitacion = req.query.state;

        // 1. MANEJO DE ERRORES INTELIGENTE
        if (err || !user) {
            const mensajeError = info?.message || 'Error de autenticación';
            
            // Si NO hay token de invitación, es un login normal que falló
            if (!tokenInvitacion || tokenInvitacion === 'undefined' || tokenInvitacion === 'null') {
                return res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(mensajeError)}`);
            }

            // Si SÍ hay token, entonces sí lo mandamos a completar registro
            return res.redirect(
                `${FRONTEND_URL}/completar-registro?token=${tokenInvitacion}&error=${encodeURIComponent(mensajeError)}`
            );
        }

        // 2. LOGIN EXITOSO (Esto se queda igual)
        const tokenSGO = jwt.sign(
            { id: user.id, rol: user.rol, nombre: user.nombre, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.redirect(`${FRONTEND_URL}/login-success?token=${tokenSGO}`);
    })(req, res, next);
});

export default router;