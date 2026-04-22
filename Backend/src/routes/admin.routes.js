import { Router } from 'express';
import { upload } from '../middlewares/importMiddlware.js';
import { importController } from '../controllers/admin/import.controller.js';
import { invitacionController } from '../controllers/admin/invitaciones.controller.js';
import { usuarioController } from '../controllers/admin/usuarios.controller.js';
import { configuracionController } from '../controllers/admin/configuracion.controller.js';
import { verificarAuth } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(verificarAuth);

// El middleware 'upload.single' ahora se importa y se usa donde se necesite
router.post('/importar', upload.single('archivo'), importController.importarReporte);
router.patch('/rap/:rapId/estructura', importController.gestionarEstructuraRap);
router.post('/invitar', invitacionController.invitarUsuario);
router.get('/roles', invitacionController.obtenerRoles);
router.get('/usuarios', usuarioController.listarUsuarios);
router.patch('/usuarios/:id/estado', usuarioController.cambiarEstado);
router.get('/listarProgramas', importController.listar);
router.get('/:id/detalle', importController.detalle);
router.get('/config/:clave', configuracionController.obtenerConfiguracion);
router.patch('/config/:clave', configuracionController.actualizarConfiguracion);

export default router;