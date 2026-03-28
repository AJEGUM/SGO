import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Admin, Rol } from '../../../services/admin/admin';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      rol_id: [null, Validators.required],
      programa_id: [null]
    });
  }

  private cargarDatosIniciales() {
    this.adminService.obtenerRoles().subscribe(res => this.roles = res);
    this.adminService.getProgramas().subscribe(res => this.programas = res);
  }

  private configurarValidacionesDinamicas() {
    // Vigilamos el cambio de rol para ajustar el formulario
    this.formUsuarios.get('rol_id')?.valueChanges.subscribe(rolId => {
      this.alternarValidacionPrograma(rolId);
    });
  }

  private alternarValidacionPrograma(rolId: number) {
    const controlPrograma = this.formUsuarios.get('programa_id');
    
    if (rolId == 2) { // ID 2 = INSTRUCTOR en tu DB
      controlPrograma?.setValidators([Validators.required]);
    } else {
      // Si no es instructor, no es obligatorio y limpiamos el valor
      controlPrograma?.clearValidators();
      controlPrograma?.setValue(null);
    }
    
    // IMPORTANTE: Avisar a Angular que las reglas del campo cambiaron
    controlPrograma?.updateValueAndValidity();
  }

  enviarRegistro() {
    if (this.formUsuarios.invalid) return;
    
    this.adminService.registrarUsuario(this.formUsuarios.value).subscribe({
      next: () => {
        alert('Usuario creado con éxito y correo enviado');
        this.formUsuarios.reset({ rol_id: null, programa_id: null });
      },
      error: (err) => alert(err.error?.message || 'Error en el registro')
    });
  }
}