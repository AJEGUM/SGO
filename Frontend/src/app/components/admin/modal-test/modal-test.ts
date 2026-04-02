import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Competencia } from '../../../services/admin/admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-test.html',
  styleUrl: './modal-test.css',
})
export class ModalTest {
  @Input() competencia: Competencia | null = null;

  // Emisor de eventos para avisar al padre que debe cerrar el modal
  @Output() close = new EventEmitter<void>();

  instruccionesExtra: string = '';
  numPreguntas: number = 5;
  generando: boolean = false;

  onClose() {
    if (!this.generando) {
      this.close.emit();
    }
  }

  lanzarGeneracion() {
    this.generando = true;
    
    // Aquí es donde harás la magia:
    // 1. Obtener detalles de la competencia (RAPs, etc)
    // 2. Concatenar con instruccionesExtra y numPreguntas
    // 3. Llamar al servicio que conecta con Gemini
    console.log('Generando test con:', {
      competenciaId: this.competencia?.id,
      preguntas: this.numPreguntas,
      extra: this.instruccionesExtra
    });
  }
}
