import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Navbar } from '../../../components/publico/navbar/navbar';
import { Footer } from '../../../components/publico/footer/footer';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.css',
})
export class Beneficios {

}
