import { Component, inject } from '@angular/core';
import { ImportService, Programa } from '../../../services/admin/import';
import { CommonModule } from '@angular/common';
import { DetalleCurricularProgramas } from '../detalle-curricular-programas/detalle-curricular-programas';

@Component({
  selector: 'app-listar-programas',
  standalone: true,
  imports: [CommonModule, DetalleCurricularProgramas],
  templateUrl: './listar-programas.html',
  styleUrl: './listar-programas.css',
})
export class ListarProgramas {
  private programaService = inject(ImportService);

  programas: Programa[] = [];
  cargando: boolean = false;
  error: string | null = null;

  // Variables del modal detalle curricular
  programaSeleccionado: any = null;
  mostrarModal: boolean = false;    

  ngOnInit(): void {
    this.cargarProgramas();
  }

  cargarProgramas(): void {
    this.cargando = true;
    this.programaService.obtenerProgramas().subscribe({
      next: (datos) => {
        this.programas = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar programas:', err);
        this.error = 'No se pudieron cargar los programas de formación.';
        this.cargando = false;
      }
    });
  }

  // Funcion para abrir el modal detalle
  verEstructura(id: number) {
    this.cargando = true;
    this.programaService.obtenerDetalle(id).subscribe({
      next: (filas) => {
        this.programaSeleccionado = filas; // Aquí pasas el array plano del SQL
        this.mostrarModal = true;
        this.cargando = false;
      },
      error: () => {
        this.error = "Error al obtener la estructura curricular";
        this.cargando = false;
      }
    });
  }
}
