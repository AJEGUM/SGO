import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar'; // Ajusta según tu ruta real

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <app-sidebar (anchoActualizado)="anchoDinamico = $event"></app-sidebar>

      <main class="flex-1 transition-[margin] duration-300 ease-in-out"
            [style.margin-left.px]="anchoDinamico">
        <div class="p-6 lg:p-10">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class InstructorLayout {
  anchoDinamico = 280; // Valor por defecto igual al de tu Sidebar
}