import { Router } from 'express';
import { authController } from '../controllers/login/login.controller.js';

const router = Router();

router.get('/google', authController.iniciarGoogle);

router.get('/google/callback', authController.googleCallback);

router.get('/logout', authController.logout);

router.get('/perfil', authController.obtenerPerfil);

export default router;