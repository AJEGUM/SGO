import { Router } from 'express';
import { expertoController } from '../controllers/expertoTematico/semillas.controller.js';
import { testController } from '../controllers/expertoTematico/testinicial.controller.js';

const router = Router();

// Ruta para que el experto vea sus semillas vinculadas
router.get('/mis-semillas', expertoController.listarMisSemillas);

router.post('/guardar-test', testController.crearTest);

router.get('/ver-test/:id', testController.obtenerTest);

export default router;