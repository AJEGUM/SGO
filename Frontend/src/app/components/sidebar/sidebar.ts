import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Output() anchoActualizado = new EventEmitter<number>();

  // Llama a esta función cada vez que cambies el ancho (redimensionar o colapsar)
  actualizarAncho() {
    this.anchoActualizado.emit(this.anchoSidebar);
  }
  estaAbiertoMovil = false;
  anchoSidebar = 280; 
  estaRedimensionando = false;
  anchoMinimo = 80;   // Cuando solo se ven iconos
  anchoMaximo = 450;
  
  // Memoria para restaurar el ancho previo
  ultimoAnchoExpandido = 280;

ngOnInit() {
  const anchoGuardado = localStorage.getItem('sidebar-width');
  if (anchoGuardado) {
    this.anchoSidebar = parseInt(anchoGuardado, 10);
    this.ultimoAnchoExpandido = this.anchoSidebar > this.anchoMinimo ? this.anchoSidebar : 280;
  }
  this.actualizarAncho(); // <-- Añadir esto
}



  // Alternar entre colapsado (80px) y el último ancho que eligió el usuario
  alternarSidebar() {
    if (this.anchoSidebar > this.anchoMinimo) {
      this.ultimoAnchoExpandido = this.anchoSidebar;
      this.anchoSidebar = this.anchoMinimo;
    } else {
      this.anchoSidebar = this.ultimoAnchoExpandido;
    }
    this.guardarPreferencia();
    this.actualizarAncho();
  }

  @HostListener('window:mousemove', ['$event'])
  alMoverMouse(evento: MouseEvent) {
    if (!this.estaRedimensionando) return;

    let nuevoAncho = evento.clientX;
    if (nuevoAncho >= this.anchoMinimo && nuevoAncho <= this.anchoMaximo) {
      this.anchoSidebar = nuevoAncho;
      this.actualizarAncho();
    }
  }

  alternarMovil() {
    this.estaAbiertoMovil = !this.estaAbiertoMovil;
  }

  iniciarRedimension(evento: MouseEvent) {
    this.estaRedimensionando = true;
    document.body.style.cursor = 'col-resize';
    evento.preventDefault();
  }

  @HostListener('window:mouseup')
  alSoltarMouse() {
    if (this.estaRedimensionando) {
      this.estaRedimensionando = false;
      document.body.style.cursor = 'default';
      this.guardarPreferencia();
      
      if (this.anchoSidebar > this.anchoMinimo) {
        this.ultimoAnchoExpandido = this.anchoSidebar;
      }
    }
  }

  private guardarPreferencia() {
    localStorage.setItem('sidebar-width', this.anchoSidebar.toString());
  }

  get estaColapsado() {
    return this.anchoSidebar <= 120;
  }
}