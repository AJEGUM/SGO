import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabla-programas',
  standalone: true,
  imports: [],
  templateUrl: './tabla-programas.html',
  styleUrl: './tabla-programas.css',
})
export class TablaProgramas {
  @Input() listaProgramas: any[] = [];
  @Output() onVerDetalle = new EventEmitter<number>();
  @Input() isLoading: boolean = false;

  verDetalle(id: number) {
    this.onVerDetalle.emit(id);
  }
}
