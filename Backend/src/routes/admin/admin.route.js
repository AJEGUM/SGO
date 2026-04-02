// admin.routes.js o similar
import { Router } from 'express';
import { protectAdmin } from '../../middlewares/auth.middleware.js'; // <-- IMPORTANTE
import { getCompetencias, getDetalleCurriculo, getProgramas, importarDiseno, patchCurriculo } from '../../controllers/admin/admin.controller.js'; // Asegúrate que el nombre coincida
import { invitar, obtenerRoles, obtenerUsuarios } from '../../controllers/admin/users.controller.js';
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

const router = Router();
router.use(protectAdmin);

router.get('/programas/:programaId/competencias', getCompetencias); 
router.get('/competencias/detalle/:id', getDetalleCurriculo); 
router.post('/upload-curriculo', upload.single('archivo'), importarDiseno);
router.patch('/patch/:tipo/:id', patchCurriculo);
router.get('/programas', getProgramas);

// Panel usuarios
router.post('/invitar', invitar);
router.get('/roles', obtenerRoles);
router.get('/usuarios', obtenerUsuarios);

export default router;