import { Component, OnInit } from '@angular/core';
import { Admin, Competencia } from '../../../services/admin/admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModalDetalleCompetencia } from '../../../components/admin/modal-detalle-competencia/modal-detalle-competencia';
import { ModalPrograma } from '../../../components/admin/modal-programa/modal-programa';
import { TablaProgramas } from '../../../components/admin/tabla-programas/tabla-programas';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalDetalleCompetencia, ModalPrograma, TablaProgramas],
  templateUrl: './importar.html',
  styleUrl: './importar.css',
})
export class Importar implements OnInit {
  // --- Variables de Estado de Archivos ---
  archivoSeleccionado: File | null = null;
  loading: boolean = false;
  
  // --- Variables de Datos ---
  listaProgramas: any[] = [];
  detalleSeleccionado: any = null; // Este array de competencias se le pasa al HIJO
  loadingDetalle: boolean = false;
  
  // --- Variables de Control de Modales ---
  showModalPrograma = false;

  constructor(private adminService: Admin) {}

  ngOnInit() {
    this.cargarProgramas();
  }

  // --- Lógica de Carga de Archivos ---
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoSeleccionado = event.target.files[0];
    }
  }

  subir() {
    if (!this.archivoSeleccionado) return;
    this.showModalPrograma = true;
  }

  confirmarCarga(datosDesdeModal: any) {
    this.loading = true;
    this.showModalPrograma = false;

    this.adminService.uploadCurriculo(this.archivoSeleccionado!, datosDesdeModal).subscribe({
      next: () => {
        this.cargarProgramas();
        Swal.fire('Éxito', 'Currículo cargado correctamente', 'success');
        this.loading = false;
        this.archivoSeleccionado = null;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo subir el archivo', 'error');
      }
    });
  }

  // --- Lógica de Visualización ---
  cargarProgramas() {
    this.adminService.getProgramas().subscribe({
      next: (data) => this.listaProgramas = data,
      error: (err) => console.error('Error al cargar programas', err)
    });
  }

  // Esta función obtiene las competencias y ALIMENTA al componente hijo
  verDetalle(programaId: number) {
    this.loadingDetalle = true;
    this.detalleSeleccionado = null; 

    this.adminService.getCompetencias(programaId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.detalleSeleccionado = data; // Al setear esto, el @if del HTML muestra el modal hijo
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Sin competencias',
            text: 'Este programa aún no tiene competencias registradas.',
            confirmButtonColor: '#39a900'
          });
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loadingDetalle = false;
      }
    });
  }

  cerrarDetalle() {
    this.detalleSeleccionado = null;
  }

  actualizar(tipo: string, id: number, event: any) {
    const elemento = event.target as HTMLInputElement;
    const nuevoValor = elemento.value;

    if (!nuevoValor.trim()) return;

    this.adminService.patchCurriculo(tipo, id, nuevoValor).subscribe({
      next: () => {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000
        }).fire({
          icon: 'success',
          title: 'Nombre actualizado'
        });
      }
    });
  }
}