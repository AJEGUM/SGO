import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImportService } from '../../../services/admin/import';

@Component({
  selector: 'app-detalle-curricular-programas',
  standalone: true, // No olvides el standalone si usas Angular 17+
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-curricular-programas.html',
  styleUrl: './detalle-curricular-programas.css',
})
export class DetalleCurricularProgramas implements OnChanges {
  // 1. Debe llamarse exactamente 'programa' para coincidir con el [programa] del padre
  @Input() programa: any = null; 
  @Output() alCerrar = new EventEmitter<void>();

  private importService = inject(ImportService);

  programaNombre: string = '';
  competencias: any[] = [];
  rapsFiltrados: any[] = [];

  idCompSeleccionada: number | null = null;
  idRapSeleccionado: number | null = null;

  form = { proceso: '', saber: '', criterio: '' };

  ngOnChanges(changes: SimpleChanges) {
    // 2. Aquí verificamos que el cambio sea en la propiedad 'programa'
    if (changes['programa'] && this.programa) {
      console.log('Datos recibidos en el hijo:', this.programa); // Debug para DevOps
      this.estructurarDatos();
    }
  }

estructurarDatos() {
  if (!this.programa) return;

  // Tu back ya envía el nombre, código y el array de competencias listo
  this.programaNombre = this.programa.nombre;
  
  // Asignamos las competencias directamente
  this.competencias = this.programa.competencias || [];

  console.log('Competencias listas para el select:', this.competencias);
}

onCompetenciaChange() {
  this.idRapSeleccionado = null;
  this.form = { proceso: '', saber: '', criterio: '' };

  // Buscamos la competencia seleccionada
  const comp = this.competencias.find(c => c.id == this.idCompSeleccionada);
  
  // IMPORTANTE: En tu back 'raps' ya es un Array, no necesitas Object.values
  this.rapsFiltrados = comp ? comp.raps : [];
  
  console.log('RAPs cargados:', this.rapsFiltrados);
}

onRapChange() {
  const rap = this.rapsFiltrados.find(r => r.id == this.idRapSeleccionado);
  if (rap) {
    // Como tu back envía Arrays (criterios, saberes, procesos), 
    // los unimos con un salto de línea para mostrarlos en el textarea
    this.form.proceso = rap.procesos.join('\n');
    this.form.saber = rap.saberes.join('\n');
    this.form.criterio = rap.criterios.join('\n');
  }
}

  guardar() {
    if (!this.idRapSeleccionado) return;

    const data = {
      rap_id: this.idRapSeleccionado,
      ...this.form
    };

    console.log('Enviando datos al servidor:', data);
    // Aquí invocarías tu servicio para persistir en SQL
    // this.importService.guardarDetalle(data).subscribe(...);
  }
}