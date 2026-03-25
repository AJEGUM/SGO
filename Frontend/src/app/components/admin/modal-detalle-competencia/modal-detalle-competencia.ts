import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Admin } from '../../../services/admin/admin';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-detalle-competencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-detalle-competencia.html',
  styleUrl: './modal-detalle-competencia.css',
})
export class ModalDetalleCompetencia {
  @Input() detalle: any[] = []; // Recibe el array de competencias filtrado
  @Output() cerrar = new EventEmitter<void>();

  constructor(private adminService: Admin) {}

  cerrarModal() {
    this.cerrar.emit();
  }

  actualizar(tipo: string, id: number, event: any) {
    const elemento = event.target as HTMLInputElement;
    const nuevoValor = elemento.value;

    if (!nuevoValor.trim()) return;

    this.adminService.patchCurriculo(tipo, id, nuevoValor).subscribe({
      next: () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
        Toast.fire({
          icon: 'success',
          title: `Nombre actualizado`
        });
      }
    });
  }
}