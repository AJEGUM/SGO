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
      if (params['token']) {
        // 1. Guardar token
        localStorage.setItem('tokenSGO', params['token']);
        
        // 2. Obtener usuario (para saber el rol)
        const user = this.authService.getUsuarioActual();
        
        // 3. Redirección profesional y dinámica
        if (user) {
          this.authService.redirigirSegunRol(user.rol_id);
        }
        return;
      }

      if (params['error']) {
        this.mensajeError = this.mapearError(params['error']);
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