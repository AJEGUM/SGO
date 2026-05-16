import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-visualizar-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-test.html',
  styleUrl: './visualizar-test.css',
})
export class VisualizarTest {
  @Input() test: any = null;
  @Output() alCerrar = new EventEmitter<void>(); // Evento para cerrar el modal desde el padre

  // Helper para generar las letras de opción (A, B, C, D) dinámicamente según el índice
  obtenerLetra(index: number): string {
    const letras = ['A', 'B', 'C', 'D', 'E'];
    return letras[index] || '•';
  }

  cerrarModal(): void {
    this.alCerrar.emit();
  }
}
