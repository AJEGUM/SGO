import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-completar-registro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completar-registro.html',
  styleUrl: './completar-registro.css'
})
export class CompletarRegistro implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  // --- Estado de la UI ---
  verModal: boolean = false; 
  cargando: boolean = true;  
  tokenInvitacion: string | null = null;
  datosInvitacion: any = null;
  mensajeError: string | null = null;

ngOnInit(): void {
  // Escuchamos los cambios de queryParams de forma reactiva
  this.route.queryParams.subscribe(params => {
    this.tokenInvitacion = params['token'];
    this.mensajeError = params['error'] || null;

    if (!this.tokenInvitacion) {
      this.router.navigate(['/login']);
      return;
    }

    // Solo cargamos los datos de la invitación si no los tenemos ya
    if (!this.datosInvitacion) {
      this.authService.verificarInvitacion(this.tokenInvitacion).subscribe({
        next: (res) => {
          this.datosInvitacion = res.data;
          this.cargando = false;
        },
        error: () => this.router.navigate(['/login'])
      });
    }
  });
}

  // --- El nuevo método de Login ---
  iniciarRegistroConGoogle(): void {
    if (this.tokenInvitacion) {
      // Redirección directa al backend
      window.location.href = this.authService.getGoogleAuthUrl(this.tokenInvitacion);
    }
  }

  toggleModal(): void {
    this.verModal = !this.verModal;
  }
}