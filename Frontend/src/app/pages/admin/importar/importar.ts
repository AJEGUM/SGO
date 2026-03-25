import { Component, OnInit } from '@angular/core';
import { Admin, Competencia } from '../../../services/admin/admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModalDetalleCompetencia } from '../../../components/admin/modal-detalle-competencia/modal-detalle-competencia';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalDetalleCompetencia],
  templateUrl: './importar.html',
  styleUrl: './importar.css',
})
export class Importar implements OnInit{
  // Variables
archivoSeleccionado: File | null = null;
loading: boolean = false;
listaCompetencias: Competencia[] = [];
detalleSeleccionado: any = null;
loadingDetalle: boolean = false;
listaProgramas: any[] = [];
archivoPdf: File | null = null;
  programaSeleccionadoId: number | null = null;
  loadingPdf: boolean = false;

// Importadores
  constructor(private adminService: Admin) {}

  // Onit permite ejecutar una funcion sin tener que recargar la pagina
  ngOnInit() {
    this.cargarProgramas();
  }

  // Funcion que recibe el archivo excel subido por el usuario
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoSeleccionado = event.target.files[0];
    }
  }

  onPdfChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoPdf = event.target.files[0];
    }
  }

  // Funcion que se ejecuta cuando se intenta subir el archivo al backend
  subir() {
    if (!this.archivoSeleccionado) return;

    this.loading = true;
    this.adminService.uploadCurriculo(this.archivoSeleccionado).subscribe({
      next: (resp) => {
        console.log('Carga exitosa', resp);
        this.cargarProgramas();
        alert('Diseño curricular cargado correctamente en la base de datos.');
        this.loading = false;
        this.archivoSeleccionado = null;
      },
      error: (err) => {
        console.error('Error en la carga', err);
        alert('Error al procesar el Excel. Revisa la consola.');
        this.loading = false;
      }
    });
  }

  subirPdf() {
    if (!this.archivoPdf || !this.programaSeleccionadoId) {
      Swal.fire('Atención', 'Selecciona un programa y un archivo PDF', 'warning');
      return;
    }

    this.loadingPdf = true;
    this.adminService.uploadDisenoPdf(this.archivoPdf, this.programaSeleccionadoId).subscribe({
      next: (resp) => {
        this.loadingPdf = false;
        this.archivoPdf = null;
        Swal.fire('¡IA Finalizada!', 'Saberes y Criterios vinculados correctamente', 'success');
      },
      error: (err) => {
        this.loadingPdf = false;
        console.error(err);
        Swal.fire('Error', 'La IA no pudo procesar el PDF: ' + err.error?.msg, 'error');
      }
    });
  }

  cargarProgramas() {
    this.adminService.getProgramas().subscribe({
      next: (data) => {
        this.listaProgramas = data;
      },
      error: (err) => console.error('Error al cargar programas', err)
    });
  }

  // Función que se dispara al dar click en la lupa/botón de la tabla de programas
  verDetalle(programaId: number) {
    this.loadingDetalle = true;
    
    // Llamamos al servicio pasando el ID de la ficha/programa seleccionado
    this.adminService.getCompetencias(programaId).subscribe({
      next: (data) => {
        // Guardamos el array de competencias en detalleSeleccionado para que el modal lo reciba
        this.detalleSeleccionado = data; 
        this.loadingDetalle = false;
      },
      error: (err) => {
        console.error('Error al cargar competencias:', err);
        Swal.fire('Error', 'No se pudieron obtener las competencias de este programa', 'error');
        this.loadingDetalle = false;
      }
    });
  }

  // Esta función la puedes dejar para refrescar si es necesario, 
  // pero ahora requiere un ID.
  cargarCompetencias(id: number) {
    this.adminService.getCompetencias(id).subscribe({
      next: (data) => this.listaCompetencias = data,
      error: (err) => console.error('Error al cargar lista', err)
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
