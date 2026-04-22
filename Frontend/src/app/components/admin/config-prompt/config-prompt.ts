import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-prompt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-prompt.html',
  styleUrl: './config-prompt.css',
})
export class ConfigPrompt {
  @Input() prompt: string = '';
  @Input() cargando: boolean = false;
  @Input() guardando: boolean = false;
  @Input() exito: boolean = false;

  @Output() promptChange = new EventEmitter<string>();
  @Output() onGuardar = new EventEmitter<void>();

  // Notifica al padre cuando el usuario escribe
  onInputChange(value: string) {
    this.promptChange.emit(value);
  }
}
