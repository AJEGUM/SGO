import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-generartest-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generartest-modal.html',
  styleUrl: './generartest-modal.css',
})
export class GenerartestModal {
  @Input() visible: boolean = false;
  @Input() competenciaNombre: string = '';
  @Output() alCerrar = new EventEmitter<void>();

  cerrar() {
    this.visible = false;
    this.alCerrar.emit();
  }
}
