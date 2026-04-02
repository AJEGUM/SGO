import { Routes } from '@angular/router';
import { roleGuard } from './guards/auth/role-guard';
import { invitacionGuard } from './guards/auth/invitacion-guard';
import { CompletarRegistro } from './pages/auth/completar-registro/completar-registro';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS (Sin Sidebar) ---
  {
    path: '',
    loadComponent: () => import('./pages/publico/inicio/inicio').then(m => m.Inicio),
    title: 'SGO - Inicio'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/publico/login/login').then(m => m.Login),
    title: 'SGO - Login'
  },
  {
    path: 'login-success',
    loadComponent: () => import('./pages/auth/login-success/login-success').then(m => m.LoginSuccess),
  },

  {
    path: 'instructor',
    loadComponent: () => import('./pages/instructor/instructor-layout/instructor-layout').then(m => m.InstructorLayout),
    canActivate: [roleGuard],
    data: { roles: [3] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/instructor/instructor-dashboard/instructor-dashboard').then(m => m.InstructorDashboard),
        title: 'Dashboard - Instructor'
      },
      // Agrega aquí futuras rutas: programas, ovas, etc.
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [roleGuard],
    data: { roles: [1] },
    children: [
      { 
        path: 'importar', 
        loadComponent: () => import('./pages/admin/importar/importar').then(m => m.Importar),
        title: 'Importar Datos - SGO'
      },
      { 
        path: 'fichas', 
        loadComponent: () => import('./pages/admin/gestion-fichas/gestion-fichas').then(m => m.GestionFichas),
        title: 'Gestion de fichas - SGO'
      },
      { 
        path: 'usuarios', 
        loadComponent: () => import('./pages/admin/usuarios/usuarios').then(m => m.Usuarios),
        title: 'Gestión de Usuarios - SGO'
      },
      { 
        path: 'gestor-ia', 
        loadComponent: () => import('./pages/admin/gestor-ia/gestor-ia').then(m => m.GestorIa),
        title: 'Gestor IA - SGO'
      },
      { path: '', redirectTo: 'importar', pathMatch: 'full' }
    ]
  },

  // --- RUTAS DE REGISTRO ---
  { 
    path: 'completar-registro', 
    component: CompletarRegistro,
    canActivate: [invitacionGuard] 
  },

  { path: '**', redirectTo: '' }
];