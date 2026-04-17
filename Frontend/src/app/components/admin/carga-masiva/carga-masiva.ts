import { Component, inject } from '@angular/core';
import { ImportService } from '../../../services/admin/import';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carga-masiva',
  imports: [CommonModule],
  templateUrl: './carga-masiva.html',
  styleUrl: './carga-masiva.css',
})
export class CargaMasiva {
private importService = inject(ImportService);

  // Estados de la interfaz
  archivoSeleccionado: File | null = null;
  estaArrastrando = false;
  cargando = false;
  estado: 'espera' | 'exito' | 'error' = 'espera';
  mensaje = '';

  // --- Manejo de Arrastre y Soltar (Drag & Drop) ---
  alArrastrarSobre(evento: DragEvent): void {
    evento.preventDefault();
    this.estaArrastrando = true;
  }

  alSalir(evento: DragEvent): void {
    evento.preventDefault();
    this.estaArrastrando = false;
  }

  alSoltar(evento: DragEvent): void {
    evento.preventDefault();
    this.estaArrastrando = false;
    const archivos = evento.dataTransfer?.files;
    if (archivos && archivos.length > 0) {
      this.validarYAsignar(archivos[0]);
    }
  }

  // --- Manejo de Selección Manual ---
  alSeleccionarArchivo(evento: any): void {
    const archivo = evento.target.files[0];
    if (archivo) {
      this.validarYAsignar(archivo);
    }
  }

  private validarYAsignar(archivo: File): void {
    const extension = archivo.name.split('.').pop()?.toLowerCase();
    if (extension === 'xlsx' || extension === 'xls') {
      this.archivoSeleccionado = archivo;
      this.estado = 'espera';
      this.mensaje = '';
    } else {
      this.archivoSeleccionado = null;
      this.estado = 'error';
      this.mensaje = 'Solo se permiten archivos de Excel (.xlsx, .xls)';
    }
  }

  // --- Envío al Backend ---
  procesarReporte(): void {
    if (!this.archivoSeleccionado) return;

    this.cargando = true;
    this.estado = 'espera';

    // Usamos tu servicio ImportService
    this.importService.subirExcel(this.archivoSeleccionado).subscribe({
      next: (respuesta) => {
        this.estado = 'exito';
        this.mensaje = respuesta.message || 'Reporte procesado y base de datos actualizada.';
        this.archivoSeleccionado = null; // Limpiar para evitar duplicados
      },
      error: (error) => {
        this.estado = 'error';
        this.mensaje = error.error?.message || 'Error al importar el reporte.';
        this.cargando = false;
        console.error('Error en carga masiva:', error);
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  descartar(): void {
    this.archivoSeleccionado = null;
    this.estado = 'espera';
    this.mensaje = '';
  }
}
