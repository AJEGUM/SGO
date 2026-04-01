import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth';
import { ActivatedRoute } from '@angular/router'; // Importación necesaria
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

  mensajeError: string | null = null;

  ngOnInit() {
    // Usamos 'this.route' (el servicio inyectado), no 'this.router'
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        const errorKey = params['error'];
        
        // Mapeo de errores para que el usuario del SENA entienda qué pasó
        if (errorKey === 'USUARIO_NO_REGISTRADO') {
          this.mensajeError = "No tienes una cuenta activa en SGO. Solicita una invitación a un administrador.";
        } else if (errorKey === 'CUENTA_INACTIVA') {
          this.mensajeError = "Tu cuenta ha sido desactivada. Contacta al monitor de ADSO.";
        } else {
          this.mensajeError = "Error en la autenticación: " + errorKey;
        }
      }
    });
  }

  loginConGoogle() {
    // Redirección directa al flujo de Passport en el Backend
    window.location.href = this.authService.getGoogleAuthUrl();
  }
}