import { Router } from 'express';
import { programaController } from '../controllers/coordinador/programa.controller.js';

const router = Router();

// Endpoint para el selector inicial del coordinador
router.get('/selector', programaController.listar);

// Endpoint para traer competencias/raps al seleccionar un programa
router.get('/:id/estructura', programaController.detalleEstructura);

export default router;