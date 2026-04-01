import { Routes } from '@angular/router';
import { CompletarRegistro } from './pages/auth/completar-registro/completar-registro';
import { invitacionGuard } from './guards/auth/invitacion-guard';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS (Sin Sidebar) ---
  {
    path: '',
    loadComponent: () => import('./pages/publico/inicio/inicio').then(m => m.Inicio),
    title: 'SGO - Sistema de Gestion de OVAs'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/publico/login/login').then(m => m.Login),
    title: 'Login - Sistema de Gestion de OVAs'
  },
  {
    path: 'como-funciona',
    loadComponent: () => import('./pages/publico/como-funciona/como-funciona').then(m => m.ComoFunciona),
    title: 'Como Funciona - Sistema de Gestion de OVAs'
  },
  {
    path: 'beneficios',
    loadComponent: () => import('./pages/publico/beneficios/beneficios').then(m => m.Beneficios),
    title: 'Beneficios - Sistema de Gestion de OVAs'
  },

  // --- RUTAS DE ADMINISTRACIÓN (Con Sidebar) ---
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'importar',
        loadComponent: () => import('./pages/admin/importar/importar').then(m => m.Importar),
        title: 'Importar - SGO'
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/admin/usuarios/usuarios').then(m => m.Usuarios),
        title: 'Usuarios - SGO'
      },
      // Aquí puedes agregar más: 'dashboard', 'usuarios', etc.
      { path: '', redirectTo: 'importar', pathMatch: 'full' }
    ]
  },

  { 
    path: 'completar-registro', 
    component: CompletarRegistro,
    canActivate: [invitacionGuard] 
  },

  // Manejo de rutas no encontradas
  { path: '**', redirectTo: '' }
];