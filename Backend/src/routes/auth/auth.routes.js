import { Router } from 'express';
import { verificarToken, completarRegistro } from '../../controllers/auth/auth.controller.js';
import { validarTokenMiddleware } from '../../middlewares/validarTokenFormato.js'; // Reutilizamos el de formato

const router = Router();

// GET: /api/auth/verificar-invitacion/:token
router.get('/verificar-invitacion/:token', validarTokenMiddleware, verificarToken);

// POST: /api/auth/completar-registro
router.post('/completar-registro', completarRegistro);

export default router;