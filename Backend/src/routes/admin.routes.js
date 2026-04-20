import { Router } from 'express';
import { upload } from '../middlewares/importMiddlware.js';
import { importController } from '../controllers/admin/import.controller.js';
import { invitacionController } from '../controllers/admin/invitaciones.controller.js';
import { usuarioController } from '../controllers/admin/usuarios.controller.js';

const router = Router();

// El middleware 'upload.single' ahora se importa y se usa donde se necesite
router.post('/importar', upload.single('archivo'), importController.importarReporte);
router.patch('/rap/:rapId/estructura', importController.gestionarEstructuraRap);
router.post('/invitar', invitacionController.invitarUsuario);
router.get('/roles', invitacionController.obtenerRoles);
router.get('/usuarios', usuarioController.listarUsuarios);
router.patch('/usuarios/:id/estado', usuarioController.cambiarEstado);
router.get('/listarProgramas', importController.listar);
router.get('/:id/detalle', importController.detalle);

export default router;