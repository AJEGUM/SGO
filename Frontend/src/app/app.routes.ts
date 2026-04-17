import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/public/inicio/inicio').then(m => m.Inicio),
    title: 'S.G.O'
  },
    {
    path: 'importar',
    loadComponent: () => import('./pages/admin/importar/importar').then(m => m.Importar),
    title: 'Importar excel'
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/admin/usuarios/usuarios').then(m => m.Usuarios),
    title: 'Gestion de usuarios'
  },
  

]