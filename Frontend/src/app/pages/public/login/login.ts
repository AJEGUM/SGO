import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/public/login-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  mostrarInvitacion = false;
  errorLogin: string | null = null;

  // Diccionario de mensajes amigables
  private readonly MENSAJES_ERROR: Record<string, string> = {
    'auth-google': 'No tienes acceso con esta cuenta institucional. Contacta al administrador si crees que es un error.',
    'unauthorized': 'No tienes permisos para ingresar al sistema.',
    'no-invitation': 'No se encontró una invitación válida para este correo.',
    'default': 'Ocurrió un problema al intentar iniciar sesión.'
  };

  constructor(
    private route: ActivatedRoute,
    private authService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['invitation'] === 'true') {
        this.mostrarInvitacion = true;
      }

      const errorCod = params['error'];
      if (errorCod) {
        // Mapeamos el código al mensaje amigable
        this.errorLogin = this.MENSAJES_ERROR[errorCod] || this.MENSAJES_ERROR['default'];
        this.mostrarInvitacion = false;
      }
    });
  }

  loginConGoogle(): void {
    this.authService.loginWithGoogle();
  }
}