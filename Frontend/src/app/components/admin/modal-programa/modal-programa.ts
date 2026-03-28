import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-programa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-programa.html',
  styleUrl: './modal-programa.css',
})
export class ModalPrograma {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<any>();

  datosPrograma = {
    nombrePrograma: '',
    codigoPrograma: '',
    versionPrograma: '1'
  };

  resetForm() {
    this.datosPrograma = { nombrePrograma: '', codigoPrograma: '', versionPrograma: '1' };
  }

  cancelar() {
    this.onClose.emit();
  }

  confirmar() {
    this.onConfirm.emit(this.datosPrograma);
    this.resetForm(); // Limpiar después de enviar
  }
}
