import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() detalle: any; // Aquí recibimos la competencia completa con sus RAPs
  @Output() cerrar = new EventEmitter<void>(); // Para avisarle al padre que lo cierre

  constructor(private adminService: Admin) {}

  // Movemos la función actualizar aquí para que el modal sea autosuficiente
  actualizar(tipo: string, id: number, event: any) {
    const elemento = event.target as HTMLInputElement | HTMLTextAreaElement;
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
          title: `Guardado automáticamente`
        });
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
