import { Router } from 'express';
import { expertoController } from '../controllers/expertoTematico/semillas.controller.js';

const router = Router();

// Ruta para que el experto vea sus semillas vinculadas
router.get('/mis-semillas', expertoController.listarMisSemillas);

export default router;