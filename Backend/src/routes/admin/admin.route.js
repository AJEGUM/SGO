// admin.routes.js o similar
import { Router } from 'express';
import { protectAuth } from '../../middlewares/auth.middleware.js'; // <-- IMPORTANTE
import { getCompetencias, getDetalleCurriculo, getProgramas, importarDiseno, patchCurriculo } from '../../controllers/admin/admin.controller.js'; // Asegúrate que el nombre coincida
import { invitar, obtenerRoles, obtenerUsuarios } from '../../controllers/admin/users.controller.js';
import { checkEvaluacion, crearFicha, getFichas, getFichasPorPrograma } from '../../controllers/admin/fichas.controller.js';
import multer from 'multer';
import { postGenerarTestIA, postGuardarTestEditado } from '../../controllers/admin/testInicial.controller.js';

const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

const router = Router();
router.use(protectAuth);

router.get('/programas/:programaId/competencias', getCompetencias); 
router.get('/competencias/detalle/:id', getDetalleCurriculo); 
router.post('/upload-curriculo', upload.single('archivo'), importarDiseno);
router.patch('/patch/:tipo/:id', patchCurriculo);
router.get('/programas', getProgramas);

// Panel usuarios
router.post('/invitar', invitar);
router.get('/roles', obtenerRoles);
router.get('/usuarios', obtenerUsuarios);

// Fichas
router.post('/fichas', crearFicha);
router.get('/fichas', getFichas);
router.get('/programas/:programaId/fichas', getFichasPorPrograma);
router.get('/evaluaciones/check', checkEvaluacion);

// IA
router.post('/ia/generar-evaluacion', postGenerarTestIA);
router.post('/evaluaciones/guardar', postGuardarTestEditado);

export default router;