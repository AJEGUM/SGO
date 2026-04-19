import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ProgramasService } from '../../../services/coordinador/programas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-semilla-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crear-semilla-component.html',
  styleUrl: './crear-semilla-component.css',
})
export class CrearSemillaComponent {
  @Output() close = new EventEmitter<void>();
  private programaService = inject(ProgramasService);
  
  // Signals para reactividad moderna
  programas = signal<any[]>([]);
  estructuraSeleccionada = signal<any>(null);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.cargarProgramas();
  }

  cargarProgramas() {
    this.programaService.getProgramasSelector().subscribe({
      next: (data) => this.programas.set(data),
      error: (err) => console.error('Error al cargar programas:', err)
    });
  }

  onProgramaChange(event: any) {
    const id = event.target.value;
    if (!id) return;

    this.loading.set(true);
    this.programaService.getEstructuraPrograma(id).subscribe({
      next: (res) => {
        this.estructuraSeleccionada.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading.set(false);
      }
    });
  }

  getTotalRaps(): number {
    return this.estructuraSeleccionada().reduce((acc: number, comp: any) => acc + (comp.raps?.length || 0), 0);
  }

  cancelar() {
    this.close.emit();
  }
}
