import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ficha, FichasService } from '../../../services/admin/fichas-service';
import { Admin } from '../../../services/admin/admin';
import { TablaFichas } from '../../../components/admin/tabla-fichas/tabla-fichas';
import { ModalFicha } from '../../../components/admin/modal-ficha/modal-ficha';


@Component({
  selector: 'app-gestion-fichas',
  standalone: true,
  // Agregamos los nuevos componentes a los imports
  imports: [CommonModule, FormsModule, TablaFichas, ModalFicha],
  templateUrl: './gestion-fichas.html',
  styleUrl: './gestion-fichas.css',
})
export class GestionFichas implements OnInit {
  fichasOriginales: Ficha[] = []; // Fuente de verdad de la DB
  fichasFiltradas: Ficha[] = [];   // Lo que se muestra en la tabla
  programas: any[] = [];
  
  // Estados de UI
  loading = false;
  mostrarModal = false;

  // Variables de filtrado
  filtroTexto: string = '';
  filtroProgramaId: number = 0;

  constructor(
    private fichasService: FichasService,
    private adminService: Admin
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    
    // 1. Traer Programas (para los selectores)
    this.adminService.getProgramas().subscribe({
      next: (res) => {
        this.programas = res;
      },
      error: (err) => console.error('Error programas:', err)
    });

    // 2. Traer Fichas (esta es la parte que faltaba)
    this.fichasService.getFichas().subscribe({
      next: (res) => {
        // Guardamos la copia original "limpia"
        this.fichasOriginales = res.filter(f => f.numero_ficha != null);
        // Aplicamos filtros para llenar fichasFiltradas por primera vez
        this.aplicarFiltros(); 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fichas:', err);
        this.loading = false;
      }
    });
  }

  // Lógica de filtrado en memoria (Rápida y eficiente)
  aplicarFiltros() {
    this.fichasFiltradas = this.fichasOriginales.filter(f => {
      console.log(typeof this.filtroProgramaId)
      const texto = this.filtroTexto.toLowerCase();
      const coincideTexto = f.numero_ficha.toLowerCase().includes(texto) || 
                            f.nombre_programa_vinculado?.toLowerCase().includes(texto);
      
      // Usamos == (doble igual) o convertimos a Number explícitamente
      const coincidePrograma = Number(this.filtroProgramaId) === 0 || 
                              Number(f.programa_id) === Number(this.filtroProgramaId);
      
      return coincideTexto && coincidePrograma;
    });
  }

  // Manejadores de eventos del Modal
  onGuardarFicha(nuevaFicha: Ficha) {
    this.fichasService.crearFicha(nuevaFicha).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.cargarDatos(); // Recargar todo
      },
      error: (err) => console.error('Error al crear ficha', err)
    });
  }

  eliminarFicha(id: number) {
    if (confirm('¿Estás seguro de eliminar esta ficha?')) {
       console.log('Eliminando ficha:', id);
       // Descomenta cuando el servicio esté listo:
       // this.fichasService.eliminar(id).subscribe(() => this.cargarDatos());
    }
  }
}