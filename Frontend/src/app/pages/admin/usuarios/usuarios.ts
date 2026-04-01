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
      // Inicializamos como array vacío explícito
      programas: [[]] 
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

  enviarInvitacion(): void {
    if (this.invitacionForm.invalid) return;

    this.cargando = true;

    // --- LIMPIEZA DE DATOS ANTES DE ENVIAR ---
    const rawValues = this.invitacionForm.value;
    
    const data: InvitacionData = {
      email: rawValues.email,
      rol_id: Number(rawValues.rol_id),
      // Filtramos cualquier valor nulo, undefined o vacío que el select haya colado
      programas: Array.isArray(rawValues.programas) 
        ? rawValues.programas.filter((p: any) => p !== null && p !== undefined && p !== '') 
        : []
    };

    this.adminService.enviarInvitacion(data).subscribe({
      next: (res) => {
        alert('¡Invitación enviada con éxito!');
        // Reseteamos a valores limpios
        this.invitacionForm.reset({
          email: '',
          rol_id: '',
          programas: []
        });
        this.cargando = false;
      },
      error: (err) => {
        alert(err.error?.msg || 'Error al enviar la invitación');
        this.cargando = false;
      }
    });
  }
}