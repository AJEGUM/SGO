import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: '',
    loadComponent: () => import('./pages/publico/inicio/inicio').then(m => m.Inicio),
    title: 'SGO - Sistema de Gestion de OVAs'
  },
{
    path: 'como-funciona',
    loadComponent: () => import('./pages/publico/como-funciona/como-funciona').then(m => m.ComoFunciona),
    title: 'Como Funciona - Sistema de Gestion de OVAs'
  },
];
