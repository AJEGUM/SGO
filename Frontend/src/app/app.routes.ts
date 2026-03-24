import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: '',
    loadComponent: () => import('./pages/publico/inicio/inicio').then(m => m.Inicio),
    title: 'SGO - Sistema de Gestion de OVAs'
  },
];
