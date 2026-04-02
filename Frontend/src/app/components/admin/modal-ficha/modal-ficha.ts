import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ficha } from '../../../services/admin/fichas-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-ficha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-ficha.html',
  styleUrl: './modal-ficha.css',
})
export class ModalFicha {
  @Input() programas: any[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Ficha>();

  // Estado local del formulario
  nuevaFicha: Ficha = {
    numero_ficha: '',
    programa_id: 0,
    fecha_inicio: '',
    fecha_fin: ''
  };

  onCerrar() {
    this.cerrar.emit();
  }

  onGuardar() {
    if (this.nuevaFicha.numero_ficha && this.nuevaFicha.programa_id > 0) {
      this.guardar.emit(this.nuevaFicha);
    }
  }
}
