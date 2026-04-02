import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ficha } from '../../../services/admin/fichas-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-fichas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-fichas.html',
  styleUrl: './tabla-fichas.css',
})
export class TablaFichas {
  @Input() fichas: Ficha[] = [];
  @Input() loading: boolean = false;

  // Emitimos eventos hacia el padre
  @Output() eliminar = new EventEmitter<number>();
  @Output() editar = new EventEmitter<Ficha>();

  onEliminar(id: number | undefined) {
    if (id) {
      this.eliminar.emit(id);
    }
  }

  onEditar(ficha: Ficha) {
    this.editar.emit(ficha);
  }
}
