import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-coodinador-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './coodinador-layout.html',
  styleUrl: './coodinador-layout.css',
})
export class CoodinadorLayout {
  anchoSidebar = 280; 

  ajustarMargen(nuevoAncho: number) {
    this.anchoSidebar = nuevoAncho;
  }

}
