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
  programas: any[] = [];
  cargando: boolean = false;

  constructor() {
    this.invitacionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      rol_id: ['', Validators.required],
      programas: [[]] 
    });

    // Escuchamos el cambio de rol para manejar la validación dinámicamente
    this.invitacionForm.get('rol_id')?.valueChanges.subscribe(rolId => {
      const programasControl = this.invitacionForm.get('programas');
      if (rolId == '3') { // ID de Instructor
        programasControl?.setValidators([Validators.required, Validators.minLength(1)]);
      } else {
        programasControl?.clearValidators();
        programasControl?.setValue([]); // Limpiamos la selección si cambia de rol
      }
      programasControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.adminService.obtenerRoles().subscribe({
      next: (res) => this.roles = res,
      error: (err) => console.error('Error al cargar roles', err)
    });

    this.adminService.getProgramas().subscribe({
      next: (res) => this.programas = res,
      error: (err) => console.error('Error al cargar programas', err)
    });

    this.adminService.obtenerUsuarios();
  }

  get esInstructor(): boolean {
    return this.invitacionForm.get('rol_id')?.value == '3';
  }

  enviarInvitacion(): void {
    if (this.invitacionForm.invalid) return;
    this.cargando = true;

    const rawValues = this.invitacionForm.value;
    const data: InvitacionData = {
      email: rawValues.email,
      rol_id: Number(rawValues.rol_id),
      // Solo enviamos programas si es instructor
      programas: this.esInstructor ? rawValues.programas : []
    };

    this.adminService.enviarInvitacion(data).subscribe({
      next: (res) => {
        alert('¡Invitación enviada con éxito!');
        this.invitacionForm.reset({ email: '', rol_id: '', programas: [] });
        this.cargando = false;
      },
      error: (err) => {
        alert(err.error?.msg || 'Error al enviar la invitación');
        this.cargando = false;
      }
    });
  }
}