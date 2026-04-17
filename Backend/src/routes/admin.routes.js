import { Router } from 'express';
import { upload } from '../middlewares/importMiddlware.js';
import { importController } from '../controllers/admin/import.controller.js';

const router = Router();

// El middleware 'upload.single' ahora se importa y se usa donde se necesite
router.post('/importar', upload.single('archivo'), importController.importarReporte);

export default router;