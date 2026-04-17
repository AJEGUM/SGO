import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/admin/usuarios-service';
import { FormsModule } from '@angular/forms';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone:true,
  imports: [FormsModule, UpperCasePipe, CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
roles: any[] = [];
  loading: boolean = false;
  status: 'idle' | 'success' | 'error' = 'idle';
  message: string = '';

  // Modelo vinculado al FormsModule
  invitacion = {
    correo: '',
    confirmarCorreo: '',
    rol_id: null
  };

  constructor(private userService: UsuariosService) {}

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.userService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: () => {
        this.status = 'error';
        this.message = 'No se pudieron cargar los roles institucional';
      }
    });
  }

  // Getter para validar coincidencia de correos en tiempo real
  get correosNoCoinciden(): boolean {
    return this.invitacion.correo !== this.invitacion.confirmarCorreo && this.invitacion.confirmarCorreo.length > 0;
  }

  enviar() {
    if (this.correosNoCoinciden) return;

    this.loading = true;
    this.status = 'idle';

    this.userService.enviarInvitacion(this.invitacion as any).subscribe({
      next: (res: any) => {
        this.status = 'success';
        this.message = res.message || 'Invitación enviada exitosamente';
        this.resetForm();
      },
      error: (err) => {
        this.status = 'error';
        this.message = err.error?.message || 'Error al procesar la invitación';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

  resetForm() {
    this.invitacion = { correo: '', confirmarCorreo: '', rol_id: null };
    this.status = 'idle';
  }
}
