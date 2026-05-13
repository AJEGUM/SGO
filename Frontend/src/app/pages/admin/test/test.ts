import { Component } from '@angular/core';
import { CompetenciaResumen, EstructuraCompetencia, ProgramaFull, TestInicialService } from '../../../services/admin/test-inicial-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeleccionarCrearTest } from "../../../components/admin/seleccionar-crear-test/seleccionar-crear-test";
import { GenerartestModal } from "../../../components/admin/generartest-modal/generartest-modal";
import { TestService } from '../../../services/expertoTematico/test-inicial';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule, SeleccionarCrearTest, GenerartestModal],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  programas: ProgramaFull[] = [];
  competenciasFiltradas: CompetenciaResumen[] = [];
  
  programaSeleccionado: number | null = null;
  competenciaSeleccionada: number | null = null;
  
  estructura: EstructuraCompetencia | null = null;
  cargando: boolean = false;
  analizandoCompetencia: boolean = false;

  testActual: any = null;
  buscandoTest: boolean = false;

  mostrarModalGenerar: boolean = false;
  nombreCompetenciaElegida: string = '';

  dataIA_ParaModal: any = null;

  constructor(private iaService: TestInicialService, private testinicialService: TestService) {}

  ngOnInit(): void {
    this.cargarDatosMaestros();
  }

  cargarDatosMaestros() {
    this.cargando = true;
    this.iaService.obtenerProgramasCompletos().subscribe({
      next: (data) => {
        this.programas = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  onProgramaChange(id: any) {
    this.programaSeleccionado = id;
    this.competenciaSeleccionada = null;
    this.estructura = null;
    
    const prog = this.programas.find(p => p.programa_id === Number(this.programaSeleccionado));
    this.competenciasFiltradas = prog ? prog.competencias : [];
  }

  prepararContexto() {
    if (!this.competenciaSeleccionada) return;
    
    // Buscamos el nombre de la competencia para pasarlo al modal
    const comp = this.competenciasFiltradas.find(c => c.id === this.competenciaSeleccionada);
    this.nombreCompetenciaElegida = comp ? comp.nombre : '';

    // Abrimos el modal directamente
    this.mostrarModalGenerar = true;

    // La lógica de iaService.obtenerEstructuraCompetencia la moveremos 
    // dentro del modal más adelante para que el modal gestione su propia carga.
  }

  onCompetenciaChange(id: any) {
  this.competenciaSeleccionada = id;
  this.testActual = null; // Limpiar test anterior
  this.estructura = null;

  if (!id) return;

  this.buscandoTest = true;

  this.iaService.consultarTestPorCompetencia(id).subscribe({
    next: (res) => {
      this.buscandoTest = false;
      if (res.existe) {
        this.testActual = res.data;
      }
    },
    error: () => {
      this.buscandoTest = false;
      console.error('Error al verificar el test');
    }
  });
}

procesarGeneracion(configuracionIA: any) {
  if (!this.competenciaSeleccionada) return;

  this.analizandoCompetencia = true; 
  this.dataIA_ParaModal = null; // Limpiar previo

  const payload = {
    competenciaId: this.competenciaSeleccionada,
    ...configuracionIA
  };

  this.iaService.generarTestConIA(payload).subscribe({
    next: (res) => {
      this.analizandoCompetencia = false;
      
      try {
        // 1. Limpieza de posibles tags de markdown que Claude a veces añade
        const cleanJson = res.data.replace(/```json|```/g, '').trim();
        const testGenerado = JSON.parse(cleanJson);
        
        // 2. IMPORTANTE: En lugar de cerrar el modal, le pasamos la data
        // Esto hará que el modal cambie su vista automáticamente
        this.dataIA_ParaModal = testGenerado; 
        
        console.log('✅ Data enviada al modal para revisión');
      } catch (e) {
        console.error('Error parseando JSON de Claude:', e);
      }
    },
    error: (err) => {
      this.analizandoCompetencia = false;
      console.error('Error en la generación de IA:', err);
    }
  });
}

confirmarYGuardar(evento: any) {
  if (!this.competenciaSeleccionada || !evento) return;

  this.analizandoCompetencia = true;

  const payload = {
    competencia_id: this.competenciaSeleccionada,
    nombre_test: evento.config?.nombre_test || 'Sin nombre',
    descripcion: evento.config?.descripcion || '',
    preguntas: evento.preguntas 
  };

  this.testinicialService.guardarTestIA(payload).subscribe({
    next: (res) => {
      this.analizandoCompetencia = false;

      Swal.fire({
        title: '¡Test Guardado!',
        text: 'El test diagnóstico se ha vinculado correctamente.',
        icon: 'success',
        confirmButtonColor: '#39A900',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          // --- LIMPIEZA TOTAL DE MODALES Y VISTAS ---
          
          // 1. Cerramos el modal de la IA
          this.mostrarModalGenerar = false;
          this.dataIA_ParaModal = null;

          // 2. IMPORTANTE: Forzamos la recarga de la competencia.
          // Al llamar a onCompetenciaChange, el servicio buscará el test que acabamos de guardar.
          // Como ahora 'res.existe' será TRUE, la UI ocultará automáticamente el 
          // componente de "Crear Test" y mostrará la tabla del test guardado.
          this.onCompetenciaChange(this.competenciaSeleccionada);
          
          // 3. Resetear flags de UI por si acaso
          this.estructura = null; 
        }
      });
    },
    error: (err) => {
      this.analizandoCompetencia = false;
      console.error('❌ Error al persistir:', err);
      Swal.fire({
        title: 'Error al guardar',
        text: 'Hubo un problema con la base de datos.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  });
}
}
