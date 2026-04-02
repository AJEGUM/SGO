import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Ahora esto devuelve el objeto decodificado { rol_id: 2, ... }
  const user = authService.getUsuarioActual(); 
  
  // Leemos los roles permitidos (ej: [1, 2] para Admin e Instructor)
  const allowedRoles = route.data['roles'] as Array<number>;

  // Verificamos el acceso
  if (user && allowedRoles.includes(user.rol_id)) {
    return true;
  }

  // Redirección si no tiene el rol de Instructor (ID 2)
  console.warn('Acceso denegado: Rol insuficiente.');
  router.navigate(['/login'], { queryParams: { error: 'SIN_PERMISOS' } });
  return false;
};