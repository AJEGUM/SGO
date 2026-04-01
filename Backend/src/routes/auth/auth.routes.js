import { Router } from 'express';
import { verificarToken, completarRegistroConGoogle } from '../../controllers/auth/auth.controller.js';
import { validarTokenMiddleware } from '../../middlewares/validarTokenFormato.js'; // Reutilizamos el de formato

const router = Router();

// GET: /api/auth/verificar-invitacion/:token
router.get('/verificar-invitacion/:token', validarTokenMiddleware, verificarToken);

// POST: /api/auth/completar-registro
router.post('/completar-registro-google', completarRegistroConGoogle);

export default router;