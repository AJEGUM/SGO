// admin.routes.js o similar
import { Router } from 'express';
import { getCompetencias, getDetalleCurriculo, getProgramas, importarDiseno, patchCurriculo } from '../controllers/admin.controller.js'; // Asegúrate que el nombre coincida
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

const router = Router();

router.get('/programas/:programaId/competencias', getCompetencias); 
router.get('/competencias/detalle/:id', getDetalleCurriculo); 
router.post('/upload-curriculo', upload.single('archivo'), importarDiseno);
router.patch('/patch/:tipo/:id', patchCurriculo);
router.get('/programas', getProgramas);

export default router;