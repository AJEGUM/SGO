import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const invitacionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Extraemos el token de los QueryParams (?token=abc...)
  const token = route.queryParams['token'];

  if (!token) {
    console.warn('Acceso denegado: No se encontró token de invitación.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};