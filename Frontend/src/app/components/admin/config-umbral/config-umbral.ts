import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-umbral',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-umbral.html',
  styleUrl: './config-umbral.css',
})
export class ConfigUmbral {
  @Input() umbral: number = 70;
  @Input() guardando: boolean = false;
  @Input() exito: boolean = false;

  @Output() umbralChange = new EventEmitter<number>();
  @Output() onGuardar = new EventEmitter<void>();

  onModelChange(value: number) {
    this.umbralChange.emit(value);
  }
}
