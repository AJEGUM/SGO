import { Component } from '@angular/core';
import { Admin, Competencia } from '../../../services/admin/admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './importar.html',
  styleUrl: './importar.css',
})
export class Importar {
archivoSeleccionado: File | null = null;
loading: boolean = false;
listaCompetencias: Competencia[] = [];
detalleSeleccionado: any = null;
loadingDetalle: boolean = false;

  constructor(private adminService: Admin) {}

  ngOnInit() {
    this.cargarCompetencias();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoSeleccionado = event.target.files[0];
    }
  }

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
        // Tip: Podrías hacer scroll automático hacia el detalle aquí
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
    const elemento = event.target as HTMLInputElement | HTMLTextAreaElement;
    const nuevoValor = elemento.value;

    if (!nuevoValor.trim()) return;

    this.adminService.patchCurriculo(tipo, id, nuevoValor).subscribe({
        next: () => {
            // Toast de éxito: elegante y no bloquea la pantalla
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: 'success',
                title: `${tipo.toUpperCase()} actualizado correctamente`
            });
        },
        error: (err) => {
            console.error('Error en PATCH:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: 'Revisa la conexión con el servidor local.',
                confirmButtonColor: '#39A900' // Verde SENA
            });
        }
    });
}
}
