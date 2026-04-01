import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-login-success',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div class="w-16 h-16 border-4 border-sena border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-black italic text-slate-800 uppercase tracking-widest text-xs">
        Configurando perfil de <span class="text-sena">SGO</span>...
      </p>
    </div>`
})
export class LoginSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        // 1. Guardamos el token primero
        localStorage.setItem('tokenSGO', token);
        
        // 2. Obtenemos el usuario decodificado desde el servicio
        const user = this.authService.getUsuarioActual();
        
        // 3. Redirección dinámica basada en el ID de tu DB [cite: 2026-02-27]
        this.redirigirSegunRol(user.rol_id);
      } else {
        this.router.navigate(['/login'], { queryParams: { error: 'NO_TOKEN' } });
      }
    });
  }

// Dentro de login-success.ts
private redirigirSegunRol(rolId: number) {
  if (rolId === 2) {
    this.router.navigate(['/instructor/dashboard']);
  } else if (rolId === 1) {
    this.router.navigate(['/admin/importar']); // Ruta por defecto para el admin
  } else {
    this.router.navigate(['/']); // O al inicio para otros roles
  }
}
}