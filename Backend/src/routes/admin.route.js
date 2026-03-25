// admin.routes.js o similar
import { Router } from 'express';
import { getCompetencias, getDetalleCurriculo, importarDiseno, patchCurriculo } from '../controllers/admin.controller.js'; // Asegúrate que el nombre coincida
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

const router = Router();

router.post('/upload-curriculo', upload.single('archivo'), importarDiseno);
router.get('/competencias', getCompetencias);
router.get('/competencias/:id', getDetalleCurriculo);
router.patch('/patch/:tipo/:id', patchCurriculo);

export default router;