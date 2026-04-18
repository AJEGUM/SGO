import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard'; // Ajusta la ruta a tu guard

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/public/inicio/inicio').then(m => m.Inicio),
    title: 'S.G.O'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login').then(m => m.Login),
    title: 'Iniciar Sesion'
  },
  {
    path: 'importar',
    loadComponent: () => import('./pages/admin/importar/importar').then(m => m.Importar),
    title: 'Importar excel',
    canActivate: [authGuard],
    data: { roles: [5] }
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/admin/usuarios/usuarios').then(m => m.Usuarios),
    title: 'Gestion de usuarios'
  },
  

]