import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  anchoSidebar = 280; 

  // Esta función recibirá el evento del componente hijo
  ajustarMargen(nuevoAncho: number) {
    this.anchoSidebar = nuevoAncho;
  }
}
