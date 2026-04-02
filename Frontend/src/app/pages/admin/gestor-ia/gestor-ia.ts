import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin, Competencia } from '../../../services/admin/admin';
import { FichasService } from '../../../services/admin/fichas-service';
import { ConfiguradorTest } from '../../../components/admin/configurador-test/configurador-test';

@Component({
  selector: 'app-gestor-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfiguradorTest],
  templateUrl: './gestor-ia.html'
})
export class GestorIa implements OnInit {
  // Datos Maestros
  programas: any[] = [];
  competencias: Competencia[] = []; 
  fichasOriginales: any[] = []; 
  fichasFiltradas: any[] = [];   

  // IDs de Selección (Vinculados al [(ngModel)] del HTML)
  programaId: number | null = null;
  competenciaId: number | null = null;
  fichaId: number | null = null;

  // Estados de UI
  cargandoCompetencias: boolean = false;
  cargandoEstado: boolean = false;
  testExistente: boolean = false;
  detallesTest: any = null; // Para almacenar fecha_lanzamiento, activo, etc.
  
  // Modal
  showModal: boolean = false;
  competenciaSeleccionada: Competencia | null = null;

  mostrandoConfigurador: boolean = false; // Controla la transición In-Place

  constructor(private adminService: Admin, private fichasService: FichasService) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // Carga paralela de programas y fichas
    this.adminService.getProgramas().subscribe(res => this.programas = res);
    this.fichasService.getFichas().subscribe(res => this.fichasOriginales = res);
  }

  onProgramaChange() {
    // 1. Limpieza de estados al cambiar la raíz (Programa)
    this.competenciaId = null;
    this.fichaId = null;
    this.testExistente = false;
    this.detallesTest = null;
    this.competencias = [];
    this.fichasFiltradas = [];
    this.mostrandoConfigurador = false;

    if (this.programaId) {
      this.cargandoCompetencias = true;
      
      // 2. Cargar Competencias vinculadas al programa
      this.adminService.getCompetencias(this.programaId).subscribe({
        next: (res) => {
          this.competencias = res;
          this.cargandoCompetencias = false;
        },
        error: () => this.cargandoCompetencias = false
      });

      // 3. Filtrar Fichas en Memoria
      // IMPORTANTE: Verifica que en tu DB el campo sea 'programa_id'
      this.fichasFiltradas = this.fichasOriginales.filter(f => f.programa_id === this.programaId);
    }
  }

  verificarExistenciaTest() {
    // Solo consultamos si ambos campos están llenos
    if (this.competenciaId && this.fichaId) {
      this.cargandoEstado = true;
      this.testExistente = false; // Reset temporal mientras carga
      
      this.fichasService.checkTestInicial(this.fichaId, this.competenciaId).subscribe({
        next: (res: any) => {
          this.testExistente = res.existe;
          this.detallesTest = res.detalles; // Guardamos la info extra de la DB
          this.cargandoEstado = false;
        },
        error: () => {
          this.cargandoEstado = false;
          this.testExistente = false;
        }
      });
    }
  }

  // --- MÉTODOS DE ACCIÓN ---

  prepararGeneracion() {
    const comp = this.competencias.find(c => c.id === this.competenciaId);
    if (comp) {
      this.competenciaSeleccionada = comp;
      this.showModal = true;
    }
  }
  generarNuevo() {
    // Si el admin decide ignorar el que ya existe
    this.testExistente = false;
    this.prepararGeneracion();
  }


  ejecutarIA(config: any) {
    console.log('Datos recibidos del hijo:', config);
    // 1. Aquí disparas tu servicio de Gemini enviando (fichaId, competenciaId, config)
    // 2. Muestras un loader (opcional)
    // 3. Al terminar exitosamente, pones mostrandoConfigurador = false
    // 4. Llamas a verificarExistenciaTest() para que el backend devuelva el nuevo test
  }

  get programaSeleccionado() {
    // Retorna el objeto completo del programa actual
    return this.programas.find(p => p.programa_id === this.programaId);
  }

  // Opcional: Si solo quieres el nombre directo
  get nombreProgramaActivo(): string {
    return this.programaSeleccionado?.nombre || 'Programa no identificado';
  }
}