import { Component } from '@angular/core';
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
export class Importar {
  // Variables
archivoSeleccionado: File | null = null;
loading: boolean = false;
listaCompetencias: Competencia[] = [];
detalleSeleccionado: any = null;
loadingDetalle: boolean = false;

// Importadores
  constructor(private adminService: Admin) {}

  // Onit permite ejecutar una funcion sin tener que recargar la pagina
  ngOnInit() {
    this.cargarCompetencias();
  }

  // Funcion que recibe el archivo excel subido por el usuario
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoSeleccionado = event.target.files[0];
    }
  }

  // Funcion que se ejecuta cuando se intenta subir el archivo al backend
  subir() {
    if (!this.archivoSeleccionado) return;

    this.loading = true;
    this.adminService.uploadCurriculo(this.archivoSeleccionado).subscribe({
      next: (resp) => {
        console.log('Carga exitosa', resp);
        this.cargarCompetencias();
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

  cargarCompetencias() {
    this.adminService.getCompetencias().subscribe({
      next: (data) => {
        this.listaCompetencias = data;
      },
      error: (err) => console.error('Error al cargar lista', err)
    });
  }

  verDetalle(id: number) {
    this.loadingDetalle = true;
    this.adminService.getDetalleCompetencia(id).subscribe({
      next: (data) => {
        this.detalleSeleccionado = data;
        this.loadingDetalle = false;
      },
      error: (err) => {
        alert('No se pudo cargar el detalle');
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
