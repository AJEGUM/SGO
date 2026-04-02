import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin, Competencia } from '../../../services/admin/admin';
import { ModalTest } from '../../../components/admin/modal-test/modal-test';

@Component({
  selector: 'app-gestor-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalTest],
  templateUrl: './gestor-ia.html'
})
export class GestorIa implements OnInit {
  programas: any[] = [];
  competencias: Competencia[] = []; 
  showModal: boolean = false;
  competenciaSeleccionada: Competencia | null = null;
  
  programaSeleccionadoId: number | null = null;
  cargandoCompetencias: boolean = false;

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.cargarProgramas();
  }

  cargarProgramas() {
    this.adminService.getProgramas().subscribe(res => {
      this.programas = res;
    });
  }

  onProgramaChange() {
    console.log('ID Seleccionado:', this.programaSeleccionadoId); // Si sale undefined, es el mapeo del HTML
    if (this.programaSeleccionadoId) {
      this.cargandoCompetencias = true;
      this.competencias = []; // Limpiar lista actual
      
      this.adminService.getCompetencias(this.programaSeleccionadoId).subscribe({
        next: (res) => {
          this.competencias = res;
          this.cargandoCompetencias = false;
        },
        error: () => this.cargandoCompetencias = false
      });
    }
  }

  generarTest(competencia: Competencia) {
    console.log('Abriendo modal para:', competencia.nombre);
    this.competenciaSeleccionada = competencia;
    this.showModal = true; // Esto activa el @if en el HTML
  }

  cerrarModal() {
    this.showModal = false;
    this.competenciaSeleccionada = null;
  }
}