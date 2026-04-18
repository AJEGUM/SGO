import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/public/login-service'; // Asegúrate de tener un servicio que guarde al usuario
import { firstValueFrom } from 'rxjs';

// auth.guard.ts
export const authGuard: CanActivateFn = async (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    // CAMBIO: Usamos getProfile() y firstValueFrom para manejar el Observable
    const res = await firstValueFrom(loginService.getProfile());

    if (res && res.autenticado) {
      const usuario = res.usuario;
      const roles = route.data['roles'] as number[];
      if (!roles || roles.includes(usuario.rol_id)) return true;
      
      router.navigate(['/']); // O la ruta por defecto según rol
      return false;
    }
  } catch (error) {
    console.error('Error en Guard:', error);
  }

  router.navigate(['/login']);
  return false;
};