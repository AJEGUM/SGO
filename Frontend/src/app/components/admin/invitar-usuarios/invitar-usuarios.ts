import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/admin/usuarios-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invitar-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './invitar-usuarios.html',
  styleUrl: './invitar-usuarios.css',
})
export class InvitarUsuarios implements OnInit {
  roles: any[] = [];
  loading: boolean = false;
  status: 'idle' | 'success' | 'error' = 'idle';
  message: string = '';

  invitacion = {
    correo: '',
    confirmarCorreo: '',
    rol_id: null
  };

  constructor(private userService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: () => {
        this.status = 'error';
        this.message = 'No se pudieron cargar los roles institucional';
      }
    });
  }

  get correosNoCoinciden(): boolean {
    return (
      this.invitacion.correo !== this.invitacion.confirmarCorreo && 
      this.invitacion.confirmarCorreo.length > 0
    );
  }

  enviar(): void {
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

  resetForm(): void {
    this.invitacion = { correo: '', confirmarCorreo: '', rol_id: null };
    // Mantenemos el status en idle después de un tiempo si fue exitoso
    setTimeout(() => this.status = 'idle', 5000);
  }
}
