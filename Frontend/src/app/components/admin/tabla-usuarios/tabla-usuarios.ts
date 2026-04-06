import { Component, inject, OnInit } from '@angular/core';
import { Admin } from '../../../services/admin/admin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-usuarios.html',
  styleUrl: './tabla-usuarios.css',
})
export class TablaUsuarios implements OnInit {
  private adminService = inject(Admin);
  usuarios: any[] = [];

  // Variables para el control del Modal
  mostrarModalProgramas: boolean = false;
  usuarioSeleccionado: any = null;
  programasDelUsuario: string[] = [];

  ngOnInit() {
    this.adminService.usuarios$.subscribe(data => {
      this.usuarios = data;
    });

    this.adminService.obtenerUsuarios();
  }

  /**
   * Abre el modal y procesa los programas del usuario
   */
  abrirModalProgramas(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    
    // Convertimos el string "Programa 1, Programa 2" en un Array
    if (usuario.programas) {
      this.programasDelUsuario = usuario.programas.split(', ');
    } else {
      this.programasDelUsuario = [];
    }

    this.mostrarModalProgramas = true;
  }

  /**
   * Cierra el modal y limpia los datos temporales
   */
  cerrarModal(): void {
    this.mostrarModalProgramas = false;
    this.usuarioSeleccionado = null;
    this.programasDelUsuario = [];
  }
}