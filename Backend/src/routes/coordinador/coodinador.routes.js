import { Router } from 'express';
import { protectAuth, permitirRoles } from '../../middlewares/auth.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { obtenerExpertos } from '../../controllers/coordinador/usuarios.controller.js';

const router = Router();

router.use(protectAuth);

router.use(permitirRoles(ROLES.COORDINADOR));

router.get('/expertos', obtenerExpertos);

export default router;