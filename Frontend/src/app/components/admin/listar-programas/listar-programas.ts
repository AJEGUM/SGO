import { Component, inject } from '@angular/core';
import { ImportService, Programa } from '../../../services/admin/import';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-programas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-programas.html',
  styleUrl: './listar-programas.css',
})
export class ListarProgramas {
  private programaService = inject(ImportService);

  programas: Programa[] = [];
  cargando: boolean = false;
  error: string | null = null;

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
}
