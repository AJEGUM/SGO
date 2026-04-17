import { Component, inject } from '@angular/core';
import { ImportService } from '../../../services/admin/import';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './importar.html',
  styleUrl: './importar.css',
})
export class Importar {
  private importService = inject(ImportService);

  selectedFile: File | null = null;
  isDragging = false;
  loading = false;
  status: 'idle' | 'success' | 'error' = 'idle';
  message = '';

  // Capturar archivo desde el input
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.prepareFile(file);
  }

  // Lógica de Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    this.prepareFile(file);
  }

  prepareFile(file: File | undefined) {
    if (!file) return;
    
    // Validar que sea Excel antes de intentar subirlo
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.selectedFile = file;
      this.status = 'idle';
    } else {
      this.status = 'error';
      this.message = 'Por favor, selecciona un archivo Excel válido.';
    }
  }

  subirReporte() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.status = 'idle';

    this.importService.uploadExcel(this.selectedFile).subscribe({
      next: (res) => {
        this.status = 'success';
        this.message = `¡Éxito! Se procesaron ${res.total} registros del reporte.`;
        this.selectedFile = null;
        this.loading = false;
      },
      error: (err) => {
        this.status = 'error';
        this.message = err.error?.message || 'Error al procesar el archivo en el servidor.';
        this.loading = false;
      }
    });
  }
}
