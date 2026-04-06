import { Router } from 'express';
import { protectAuth, permitirRoles } from '../../middlewares/auth.middleware.js';
import { ROLES } from '../../constants/roles.js';
import multer from 'multer';

// Controladores
import { getCompetencias, getDetalleCurriculo, getProgramas, importarDiseno, patchCurriculo } from '../../controllers/admin/admin.controller.js';
import { invitar, obtenerRoles, obtenerUsuarios } from '../../controllers/admin/users.controller.js';
import { checkEvaluacion, crearFicha, getFichas, getFichasPorPrograma } from '../../controllers/admin/fichas.controller.js';
import { postGenerarTestIA, postGuardarTestEditado } from '../../controllers/admin/testInicial.controller.js';

const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

const router = Router();

// 1. GLOBAL: Todas estas rutas requieren TOKEN válido
router.use(protectAuth);

// 2. SEGURIDAD CENTRALIZADA: Solo el ADMIN puede tocar estas rutas
// Si alguna también la debe ver el Coordinador, solo agregas ROLES.COORDINADOR
router.use(permitirRoles(ROLES.ADMIN));

/** --- RUTAS DE CURRÍCULO --- **/
router.get('/programas', getProgramas);
router.get('/programas/:programaId/competencias', getCompetencias); 
router.get('/competencias/detalle/:id', getDetalleCurriculo); 
router.post('/upload-curriculo', upload.single('archivo'), importarDiseno);
router.patch('/patch/:tipo/:id', patchCurriculo);

/** --- PANEL DE USUARIOS --- **/
router.post('/invitar', invitar);
router.get('/roles', obtenerRoles);
router.get('/usuarios', obtenerUsuarios);

/** --- GESTIÓN DE FICHAS --- **/
router.post('/fichas', crearFicha);
router.get('/fichas', getFichas);
router.get('/programas/:programaId/fichas', getFichasPorPrograma);
router.get('/evaluaciones/check', checkEvaluacion);

/** --- INTELIGENCIA ARTIFICIAL & TEST --- **/
router.post('/ia/generar-evaluacion', postGenerarTestIA);
router.post('/evaluaciones/guardar', postGuardarTestEditado);

export default router;