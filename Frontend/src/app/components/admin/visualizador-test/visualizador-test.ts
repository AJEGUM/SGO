import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizador-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizador-test.html',
  styleUrl: './visualizador-test.css',
})
export class VisualizadorTest {
  @Input() test: any;

  // Acceso seguro a las opciones para evitar errores en el template
  getOpcionTexto(item: any, letra: string): string {
    return item.opciones && item.opciones[letra] ? item.opciones[letra] : 'Opción no generada';
  }

  get tituloEvaluacion(): string {
    if (!this.test) return 'Cargando Evaluación...';
    
    // Si el nombre viene con 'undefined' por falta de algún dato en el prompt
    if (!this.test.evaluacion_nombre || this.test.evaluacion_nombre.includes('undefined')) {
      return 'Propuesta de Evaluación Técnica';
    }
    
    return this.test.evaluacion_nombre;
  }
}
