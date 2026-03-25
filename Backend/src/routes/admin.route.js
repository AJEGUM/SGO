// admin.routes.js o similar
import { Router } from 'express';
import { getCompetencias, getDetalleCurriculo, getProgramas, importarDiseno, patchCurriculo, procesarDisenoPdf } from '../controllers/admin.controller.js'; // Asegúrate que el nombre coincida
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

const router = Router();

// Ruta para cargar el archivo
router.post('/upload-curriculo', upload.single('archivo'), importarDiseno);
// Ruta para obtener las competencias registradas
router.get('/competencias/:programaId', getCompetencias);
// Ruta para obtener la informacion relacionada a una ruta
router.get('/competencias/:id', getDetalleCurriculo);
// Ruta para actualizar la informacion de una competencia
router.patch('/patch/:tipo/:id', patchCurriculo);
router.get('/programas', getProgramas);
router.post('/programas/procesar-pdf/:programaId', upload.single('pdf'), procesarDisenoPdf);
export default router;