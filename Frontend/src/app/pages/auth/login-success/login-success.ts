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
// En login-success.ts
export class LoginSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        localStorage.setItem('tokenSGO', token);
        const user = this.authService.getUsuarioActual();
        
        if (user) {
          this.authService.redirigirSegunRol(user.rol_id);
        }
      } else {
        this.router.navigate(['/login'], { queryParams: { error: 'NO_TOKEN' } });
      }
    });
  }
}