import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/public/login-service'; // Asegúrate de tener un servicio que guarde al usuario
import { firstValueFrom } from 'rxjs';

// auth.guard.ts
export const authGuard: CanActivateFn = async (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // 1. Si ya tenemos al usuario en el Signal, no llamamos al backend
  let usuario = loginService.currentUser();

  if (!usuario) {
    try {
      // 2. Solo si no hay usuario, intentamos recuperarlo
      const res = await firstValueFrom(loginService.getProfile());
      if (res && res.autenticado) {
        usuario = res.usuario;
      }
    } catch (error) {
      console.error('Sesión no encontrada en el Guard');
    }
  }

  // 3. Validación de Roles
  if (usuario) {
    const roles = route.data['roles'] as number[];
    if (!roles || roles.includes(usuario.rol_id)) return true;
    
    router.navigate(['/dashboard']); // O tu ruta base
    return false;
  }

  router.navigate(['/login']);
  return false;
};