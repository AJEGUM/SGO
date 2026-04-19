import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core'; // Agregada OnInit
import { UsuariosService } from '../../../services/admin/usuarios-service';

// 1. Exportamos la interfaz para que sea reutilizable
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
  rol_nombre: string;
  created_at: string;
}

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-usuarios.html',
  styleUrl: './listar-usuarios.css',
})
export class ListarUsuarios implements OnInit {
  private usuariosService = inject(UsuariosService);
  
  // 2. Tipamos la señal correctamente
  usuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando.set(true);
    // Ahora 'data' será automáticamente Usuario[]
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  // 3. Tipamos el parámetro 'user' como Usuario
  toggleEstado(user: Usuario) {
    const nuevoEstado = !user.activo;
    this.usuariosService.actualizarEstado(user.id, nuevoEstado).subscribe({
      next: () => {
        this.usuarios.update(prev => 
          prev.map(u => u.id === user.id ? { ...u, activo: nuevoEstado } : u)
        );
      }
    });
  }
}