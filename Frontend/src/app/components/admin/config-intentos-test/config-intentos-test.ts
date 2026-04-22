import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-intentos-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-intentos-test.html',
  styleUrl: './config-intentos-test.css',
})
export class ConfigIntentosTest {
  @Input() intentos: number = 3;
  @Input() guardando: boolean = false;
  @Input() exito: boolean = false;

  @Output() intentosChange = new EventEmitter<number>();
  @Output() onActualizar = new EventEmitter<void>();

  onModelChange(value: number) {
    this.intentosChange.emit(value);
  }
}
