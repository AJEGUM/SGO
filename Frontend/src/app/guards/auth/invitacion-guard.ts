import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const invitacionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = route.queryParams['token'];

  // Validación básica: que exista y que no sea una cadena vacía
  if (!token || token.trim().length < 10) { 
    console.warn('Acceso denegado: Token de invitación inválido o ausente.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};