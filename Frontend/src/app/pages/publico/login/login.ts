import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth';
import { ActivatedRoute, Router } from '@angular/router'; // Importación necesaria
import { CommonModule } from '@angular/common'; // Necesario para el *ngIf del error

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule], // Agregamos CommonModule
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute); // Inyectamos la ruta activa
  private router = inject(Router);

  mostrarModalInfo: boolean = false;
  mensajeError: string | null = null;

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    // 1. ¿Viene un token en la URL? (Ej: ?token=ey...)
    if (params['token']) {
      localStorage.setItem('tokenSGO', params['token']);
      
      // 2. Ahora que ya hay token, navegamos al dashboard o donde corresponda
      // Al navegar por Router, el Interceptor ya estará listo para la próxima petición
      this.router.navigate(['/instructor']); 
      return;
    }

    // 3. Si no hay token, verificar si hay errores
    if (params['error']) {
      const errorKey = params['error'];
      this.mensajeError = this.mapearError(errorKey);
    }
  });
}

private mapearError(key: string): string {
  const errores: any = {
    'USUARIO_NO_REGISTRADO': "No tienes una cuenta activa en SGO.",
    'CUENTA_INACTIVA': "Tu cuenta ha sido desactivada.",
    'DEFAULT': "Error en la autenticación: " + key
  };
  return errores[key] || errores['DEFAULT'];
}

  loginConGoogle() {
    // Redirección directa al flujo de Passport en el Backend
    window.location.href = this.authService.getGoogleAuthUrl();
  }
}