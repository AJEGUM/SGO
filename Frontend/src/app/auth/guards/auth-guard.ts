import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/public/login-service'; // Asegúrate de tener un servicio que guarde al usuario

// auth.guard.ts
export const authGuard: CanActivateFn = async (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // Si acabamos de aterrizar del redirect, esperamos 100ms 
  // para que el navegador asiente las cookies.
  await new Promise(resolve => setTimeout(resolve, 100));

  const usuario = await loginService.verificarPerfil();

  if (usuario) {
    const roles = route.data['roles'] as number[];
    if (!roles || roles.includes(usuario.rol_id)) return true;
    router.navigate(['/']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};