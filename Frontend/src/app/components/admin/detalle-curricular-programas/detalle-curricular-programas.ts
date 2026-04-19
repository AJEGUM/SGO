import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnChanges, SimpleChanges, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstructuraRapPayload, ImportService } from '../../../services/admin/import';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-detalle-curricular-programas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-curricular-programas.html',
  styleUrl: './detalle-curricular-programas.css',
})
export class DetalleCurricularProgramas implements OnChanges, OnDestroy {
  @Input() programa: any = null;
  @Output() alCerrar = new EventEmitter<void>();

  private importService = inject(ImportService);
  private destroy$ = new Subject<void>();
  private debouncer = new Subject<void>();

  showToast = signal(false);
  toastMsg = signal('');

  programaNombre: string = '';
  competencias: any[] = [];
  rapsFiltrados: any[] = [];
  idCompSeleccionada: number | null = null;
  idRapSeleccionado: number | null = null;
  form = { proceso: '', saber: '', criterio: '' };

  constructor() {
    // Configuración del guardado automático (Debounce)
    this.debouncer.pipe(
      debounceTime(800), // Espera 800ms después de que el usuario deja de escribir
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.autoGuardar();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['programa'] && this.programa) {
      this.estructurarDatos();
    }
  }

  estructurarDatos() {
    if (!this.programa) return;
    this.programaNombre = this.programa.nombre;
    this.competencias = this.programa.competencias || [];
  }

  onCompetenciaChange() {
    this.idRapSeleccionado = null;
    this.form = { proceso: '', saber: '', criterio: '' };
    const comp = this.competencias.find(c => c.id == this.idCompSeleccionada);
    this.rapsFiltrados = comp ? comp.raps : [];
  }

  onRapChange() {
    const rap = this.rapsFiltrados.find(r => r.id == this.idRapSeleccionado);
    if (rap) {
      this.form.proceso = (rap.procesos || []).join('\n');
      this.form.saber = (rap.saberes || []).join('\n');
      this.form.criterio = (rap.criterios || []).join('\n');
    }
  }

  // Se dispara cada vez que el usuario escribe algo
  notificarCambio() {
    if (this.idRapSeleccionado) {
      this.debouncer.next();
    }
  }

  lanzarToast(mensaje: string) {
    this.toastMsg.set(mensaje);
    this.showToast.set(true);
    // Timeout para ocultarlo
    setTimeout(() => this.showToast.set(false), 2000);
  }

  autoGuardar(silent: boolean = false) {
    if (!this.idRapSeleccionado) return;

    const payload: EstructuraRapPayload = {
      proceso: this.form.proceso.trim(),
      saber: this.form.saber.trim(),
      criterio: this.form.criterio.trim()
    };

    this.importService.gestionarEstructuraRap(this.idRapSeleccionado, payload).subscribe({
      next: () => {
        if (!silent) this.lanzarToast("Sincronizado con éxito");
      },
      error: () => {
        if (!silent) this.lanzarToast("Error de conexión");
      }
    });
  }

  finalizarEdicion() {
    if (this.idRapSeleccionado) {
      // Guardado final forzado antes de salir
      this.autoGuardar(true);
      setTimeout(() => this.alCerrar.emit(), 100);
    } else {
      this.alCerrar.emit();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}