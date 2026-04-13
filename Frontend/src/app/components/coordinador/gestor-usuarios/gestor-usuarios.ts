import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestor-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestor-usuarios.html',
  styleUrl: './gestor-usuarios.css',
})
export class GestorUsuarios {
  @Input() expertos: any[] = [];

  // Estado para el modal
  isModalOpen = false;
  selectedExp: any = null;

  abrirModal(experto: any) {
    this.selectedExp = experto;
    this.isModalOpen = true;
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.selectedExp = null;
    // Restaurar scroll
    document.body.style.overflow = 'auto';
  }
}