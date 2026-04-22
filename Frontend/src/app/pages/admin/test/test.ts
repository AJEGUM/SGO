import { Component } from '@angular/core';
import { CompetenciaResumen, EstructuraCompetencia, ProgramaFull, TestInicialService } from '../../../services/admin/test-inicial-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private iaService: TestInicialService) {}

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

  onProgramaChange() {
    this.competenciaSeleccionada = null;
    this.estructura = null;
    const prog = this.programas.find(p => p.programa_id === Number(this.programaSeleccionado));
    this.competenciasFiltradas = prog ? prog.competencias : [];
  }

  prepararContexto() {
    if (!this.competenciaSeleccionada) return;
    
    this.analizandoCompetencia = true;
    this.iaService.obtenerEstructuraCompetencia(this.competenciaSeleccionada).subscribe({
      next: (data) => {
        this.estructura = data;
        this.analizandoCompetencia = false;
      },
      error: () => this.analizandoCompetencia = false
    });
  }
}
