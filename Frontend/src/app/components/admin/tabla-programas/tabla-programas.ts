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
  if (id === undefined) {
    console.error("DEBUG: El ID del programa es UNDEFINED. Revisa el objeto 'prog' en el @for");
    return;
  }
  this.onVerDetalle.emit(id);
}

// Función temporal para debug
reportarError(prog: any) {
  console.log("Error: El objeto programa no tiene ID:", prog);
}
}
