import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Admin, Rol, InvitacionData } from '../../../services/admin/admin';
import { TablaUsuarios } from '../../../components/admin/tabla-usuarios/tabla-usuarios';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaUsuarios],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(Admin);

  invitacionForm: FormGroup;
  roles: Rol[] = [];
  cargando: boolean = false;

  constructor() {
    // Formulario simplificado: Solo lo necesario para la invitación
    this.invitacionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      rol_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    // Cargamos solo los roles disponibles
    this.adminService.obtenerRoles().subscribe({
      next: (res) => this.roles = res,
      error: (err) => console.error('Error al cargar roles', err)
    });

    // Actualizamos la lista de usuarios invitados/registrados
    this.adminService.obtenerUsuarios();
  }

  enviarInvitacion(): void {
    if (this.invitacionForm.invalid) return;
    
    this.cargando = true;
    const rawValues = this.invitacionForm.value;

    const data: InvitacionData = {
      email: rawValues.email,
      rol_id: Number(rawValues.rol_id)
    };

    this.adminService.enviarInvitacion(data).subscribe({
      next: (res) => {
        // Podrías cambiar este alert por un Toast de PrimeNG para mantener el nivel pro del diseño
        console.log('¡Invitación enviada con éxito!'); 
        this.invitacionForm.reset({ email: '', rol_id: '' });
        this.cargando = false;
        
        // Refrescamos la tabla de usuarios para que aparezca el nuevo invitado
        this.adminService.obtenerUsuarios();
      },
      error: (err) => {
        console.error('Error al enviar la invitación', err);
        this.cargando = false;
      }
    });
  }
}