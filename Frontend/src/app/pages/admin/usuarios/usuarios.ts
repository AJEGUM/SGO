import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Admin, Rol } from '../../../services/admin/admin';
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

  formUsuarios!: FormGroup;
  roles: Rol[] = [];
  programas: any[] = [];
  cargando: boolean = false;

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarDatosIniciales();
    this.configurarValidacionesDinamicas();
  }

  private inicializarFormulario() {
    this.formUsuarios = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol_id: [null, [Validators.required]],
      programa_id: [null]
    });
  }

  private cargarDatosIniciales() {
    this.adminService.obtenerRoles().subscribe(res => this.roles = res);
    this.adminService.getProgramas().subscribe(res => this.programas = res);
  }

  private configurarValidacionesDinamicas() {
    // Detectar cambios en el Rol para activar/desactivar Programa
    this.formUsuarios.get('rol_id')?.valueChanges.subscribe(rolId => {
      this.alternarValidacionPrograma(rolId);
    });
  }

  private alternarValidacionPrograma(rolId: any) {
    const controlPrograma = this.formUsuarios.get('programa_id');
    if (!controlPrograma) return;

    // Si el Rol es 2 (Instructor), el programa es Obligatorio
    if (Number(rolId) === 2) { 
      controlPrograma.setValidators([Validators.required]);
    } else {
      // Si no es instructor, limpiamos y quitamos validación
      controlPrograma.clearValidators();
      controlPrograma.setValue(null);
    }

    // Sincronizar estado del control
    controlPrograma.updateValueAndValidity({ emitEvent: false });
  }

  enviarRegistro() {
    if (this.formUsuarios.invalid) return;
    
    this.cargando = true;
    console.log("Enviando datos:", this.formUsuarios.value);

    this.adminService.registrarUsuario(this.formUsuarios.value).subscribe({
      next: (res) => {
        alert('Usuario creado con éxito y asignaciones procesadas');
        this.formUsuarios.reset({ rol_id: null, programa_id: null });
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error en registro:", err);
        alert(err.error?.message || 'Error en el servidor');
        this.cargando = false;
      }
    });
  }
}