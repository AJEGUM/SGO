import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin, Competencia } from '../../../services/admin/admin';
import { FichasService } from '../../../services/admin/fichas-service';
import { ConfiguradorTest } from '../../../components/admin/configurador-test/configurador-test';
import { TestInicial } from '../../../services/admin/test-inicial';
import { VisualizadorTest } from '../../../components/admin/visualizador-test/visualizador-test';
import { VisualizadoFinalTest } from "../../../components/admin/visualizado-final-test/visualizado-final-test";

@Component({
  selector: 'app-gestor-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfiguradorTest, VisualizadorTest, VisualizadoFinalTest],
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

  cargandoIA: boolean = false;
  testVisualizar: any = null;

  constructor(private adminService: Admin, private fichasService: FichasService, private testInicial: TestInicial) {}

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
    this.testVisualizar = null;

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
  if (this.competenciaId && this.fichaId) {
    this.cargandoEstado = true;
    this.testExistente = false;
    this.testVisualizar = null; 

    this.testInicial.checkTestInicial(this.fichaId, this.competenciaId).subscribe({
      next: (res: any) => {
        this.testExistente = res.existe;
        this.detallesTest = res.detalles;

        // Si existe y el backend nos mandó el json_test, lo cargamos de una
        if (res.existe && res.detalles?.json_test) {
          this.cargarTestParaVisualizar(res.detalles.json_test);
        }

        this.cargandoEstado = false;
      },
      error: () => {
        this.cargandoEstado = false;
        this.testExistente = false;
      }
    });
  }
}

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
  this.cargandoIA = true;
  this.testVisualizar = null;

  this.testInicial.generarConIA(config).subscribe({
    next: (res) => {
      this.cargandoIA = false;
      this.mostrandoConfigurador = false;
      
      // Ahora res.test viene del controller corregido
      if (res.test) {
        this.cargarTestParaVisualizar(res.test);
      } else if (res.data) { // Por si acaso dejaste el nombre anterior
        this.cargarTestParaVisualizar(res.data);
      }

      this.testExistente = false; 
    },
    error: (err) => {
      this.cargandoIA = false;
      console.error('Error:', err);
    }
  });
}

// En src/app/pages/admin/gestor-ia/gestor-ia.ts

confirmarYGuardarEvaluacion() {
  if (!this.testVisualizar || !this.fichaId || !this.competenciaId) {
    alert('Faltan datos para poder guardar la evaluación.');
    return;
  }

  // Preparamos el payload según lo que espera tu nuevo controlador
  const payload = {
    ficha_id: this.fichaId,
    competencia_id: this.competenciaId,
    json_test: this.testVisualizar, // Aquí va el JSON con los cambios manuales
    anotaciones: 'Evaluación diagnóstica validada por el instructor.'
  };

  this.cargandoEstado = true; // Reutilizamos un loader para el botón

  this.testInicial.guardarTestFinal(payload).subscribe({
    next: (res) => {
      this.cargandoEstado = false;
      this.testExistente = true;
      this.testVisualizar = null; // Cerramos el visualizador de edición
      
      // Actualizamos los detalles para que el UI refleje que ya existe
      this.detallesTest = {
        fecha_lanzamiento: new Date(),
        activo: true
      };

      // Aquí podrías usar un SweetAlert2 si lo tienes instalado
      alert('¡Éxito! La evaluación ha sido guardada y activada para los aprendices.');
    },
    error: (err) => {
      this.cargandoEstado = false;
      console.error('Error al guardar:', err);
      alert('Error técnico al guardar: ' + (err.error?.message || 'Intente de nuevo'));
    }
  });
}

  get programaSeleccionado() {
    // Retorna el objeto completo del programa actual
    return this.programas.find(p => p.programa_id === this.programaId);
  }

  // Opcional: Si solo quieres el nombre directo
  get nombreProgramaActivo(): string {
    return this.programaSeleccionado?.nombre || 'Programa no identificado';
  }

  private cargarTestParaVisualizar(data: any) {
    if (!data) return;
    try {
      // Si es string (desde MySQL), parseamos. Si es objeto (desde la IA), asignamos.
      this.testVisualizar = typeof data === 'string' ? JSON.parse(data) : data;
      
    } catch (e) {
      console.error("Error al parsear el JSON del test:", e);
    }
  }
}