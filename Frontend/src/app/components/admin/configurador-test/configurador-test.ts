import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configurador-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurador-test.html',
  styleUrl: './configurador-test.css',
})
export class ConfiguradorTest {
  @Input() programaId!: number;     
  @Input() nombrePrograma: string = '';
  @Input() fichaId!: number;
  @Input() competenciaId!: number;
  @Output() cancelar = new EventEmitter<void>();
  @Output() generar = new EventEmitter<any>();

  config = {
    numPreguntas: 5,
    dificultad: 'intermedio',
    enfoque: ''
  };

  onCancelar() { this.cancelar.emit(); }

  iniciarGeneracion() {
    this.generar.emit({
      ...this.config,
      programaId: this.programaId,
      fichaId: this.fichaId,
      competenciaId: this.competenciaId
    });
  }

}
