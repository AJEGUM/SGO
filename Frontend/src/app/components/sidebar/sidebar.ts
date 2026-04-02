import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Output() anchoActualizado = new EventEmitter<number>();
  private authService = inject(AuthService);
  
  usuario: any = null;
  menuItems: any[] = []; // Se llena dinámicamente

  // --- VARIABLES DE UI ---
  estaAbiertoMovil = false;
  anchoSidebar = 280; 
  estaRedimensionando = false;
  anchoMinimo = 80;   
  anchoMaximo = 450;
  ultimoAnchoExpandido = 280;

  // --- DICCIONARIO DE MENÚS POR ROL ---
// sidebar.component.ts
private readonly CONFIG_MENUS: { [key: number]: any[] } = {
  1: [ // ADMIN
    { label: 'Importar Datos', route: '/admin/importar', icon: 'pi pi-upload' },
    { label: 'Usuarios', route: '/admin/usuarios', icon: 'pi pi-users' }
  ],
  3: [ // INSTRUCTOR
    { label: 'Dashboard', route: '/instructor/dashboard', icon: 'pi pi-th-large' },
    { label: 'Mis Programas', route: '/instructor/programas', icon: 'pi pi-book' },
    { label: 'Gestión de OVAs', route: '/instructor/ovas', icon: 'pi pi-clone' },
    { label: 'Banco de Preguntas', route: '/instructor/questions', icon: 'pi pi-question-circle' }
  ],
  6: [ // APRENDIZ
    { label: 'Mis OVAs', route: '/aprendiz/mis-ovas', icon: 'pi pi-play' },
    { label: 'Progreso', route: '/aprendiz/progreso', icon: 'pi pi-percentage' }
  ],
  2: [ // COORDINADOR
    { label: 'Mis OVAs', route: '/aprendiz/mis-ovas', icon: 'pi pi-play' },
    { label: 'Progreso', route: '/aprendiz/progreso', icon: 'pi pi-percentage' }
  ]
};

  ngOnInit() {
    // 1. Obtener usuario y asignar su menú según rol
    this.usuario = this.authService.getUsuarioActual();
    if (this.usuario && this.usuario.rol_id) {
      this.menuItems = this.CONFIG_MENUS[this.usuario.rol_id] || [];
    }

    // 2. Persistencia de ancho
    const anchoGuardado = localStorage.getItem('sidebar-width');
    if (anchoGuardado) {
      this.anchoSidebar = parseInt(anchoGuardado, 10);
      this.ultimoAnchoExpandido = this.anchoSidebar > this.anchoMinimo ? this.anchoSidebar : 280;
    }
    this.actualizarAncho();
  }

  // --- MÉTODOS DE FUNCIONAMIENTO ---
  actualizarAncho() {
    this.anchoActualizado.emit(this.anchoSidebar);
  }

  logout() {
    this.authService.logout();
  }

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

  @HostListener('window:mouseup')
  alSoltarMouse() {
    if (this.estaRedimensionando) {
      this.estaRedimensionando = false;
      document.body.style.cursor = 'default';
      this.guardarPreferencia();
      if (this.anchoSidebar > this.anchoMinimo) this.ultimoAnchoExpandido = this.anchoSidebar;
    }
  }

  iniciarRedimension(evento: MouseEvent) {
    this.estaRedimensionando = true;
    document.body.style.cursor = 'col-resize';
    evento.preventDefault();
  }

  private guardarPreferencia() {
    localStorage.setItem('sidebar-width', this.anchoSidebar.toString());
  }

  get estaColapsado() {
    return this.anchoSidebar <= 120;
  }

  alternarMovil() {
    this.estaAbiertoMovil = !this.estaAbiertoMovil;
  }
}