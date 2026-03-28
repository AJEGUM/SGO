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
  @Input() detalle: any[] = []; // Recibe las competencias
  @Output() cerrar = new EventEmitter<void>();

  // Variables de estado
  compSeleccionada: any = null;
  rapsDeLaComp: any[] = [];    // Lista de RAPs
  rapSeleccionado: any = null; // RAP que se está editando
  tabActual: string = 'Procesos';
  textoRegistro: string = '';
  loadingRaps: boolean = false;

  constructor(private adminService: Admin) {}

  // Se ejecuta cuando el usuario elige una competencia en el select
  onSeleccionarComp() {
    if (!this.compSeleccionada) return;
    
    this.loadingRaps = true;
    this.rapSeleccionado = null; 
    this.rapsDeLaComp = [];
    
    this.adminService.getDetalleCompetencia(this.compSeleccionada.id).subscribe({
      next: (data) => {
        // Importante: Tu backend devuelve 'raps', asegúrate de asignarlo así
        this.rapsDeLaComp = data.raps || []; 
        this.loadingRaps = false;
        console.log("Raps cargados:", this.rapsDeLaComp); // Debug para verificar en consola
      },
      error: () => {
        this.loadingRaps = false;
      }
    });
  }

  // Al cambiar entre Procesos, Saberes o Criterios
  cambiarTab(nuevaTab: string) {
    this.tabActual = nuevaTab;
    this.cargarTextoDelRap();
  }

  // Carga el texto que ya existe en el RAP seleccionado según la TAB
cargarTextoDelRap() {
  if (!this.rapSeleccionado) return;
  
  const mapa: any = {
    'Procesos': 'procesos', // Antes tenías 'con_proceso'
    'Saberes': 'saberes',   // Antes tenías 'con_saber'
    'Criterios': 'criterios'
  };
  
  const categoria = mapa[this.tabActual];
  const lista = this.rapSeleccionado[categoria] || [];
  
  // Como el backend devuelve [{id, descripcion}, ...], debemos extraer solo el texto
  this.textoRegistro = lista.map((item: any) => item.descripcion).join('\n');
}

guardarDato() {
  if (!this.rapSeleccionado || this.textoRegistro === undefined) return;

  const textoLimpio = this.textoRegistro.trim();
  
  // Enviamos 'procesos', 'saberes' o 'criterios'
  const tipo = this.tabActual.toLowerCase(); 

  this.adminService.patchCurriculo(tipo, this.rapSeleccionado.id, textoLimpio)
    .subscribe({
      next: () => {
        const mapa: any = { 'Procesos': 'procesos', 'Saberes': 'saberes', 'Criterios': 'criterios' };
        const categoria = mapa[this.tabActual];
        
        // Actualización local para que no tengas que recargar
        this.rapSeleccionado[categoria] = textoLimpio
          .split('\n')
          .filter(linea => linea.trim() !== '')
          .map(line => ({ descripcion: line.trim() }));

        this.notificarExito();
      },
      error: (err) => {
        console.error("Error en el Patch:", err);
        Swal.fire('Error', 'No se pudo sincronizar el cambio', 'error');
      }
    });
}

private notificarExito() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true
  });
  Toast.fire({ icon: 'success', title: 'Sincronizado' });
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

  cerrarModal() {
    this.cerrar.emit();
  }
}