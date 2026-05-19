import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Navbar } from '../../../components/public/navbar/navbar';
import { Footer } from '../../../components/public/footer/footer';
import { Mision } from '../../../components/public/inicio/mision/mision';
import { Claudeia } from "../../../components/public/inicio/claudeia/claudeia";
import { Diferente } from "../../../components/public/inicio/diferente/diferente";

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterModule, Navbar, Footer, Mision, Claudeia, Diferente],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  constructor(private router: Router) {}

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}
