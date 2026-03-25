import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
menuAbierto: boolean = false;

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    this.gestionarScroll();
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
    this.gestionarScroll();
  }

  private gestionarScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.menuAbierto ? 'hidden' : 'auto';
    }
  }
}
