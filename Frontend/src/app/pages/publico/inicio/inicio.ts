import { Component } from '@angular/core';
import { Navbar } from '../../../components/publico/navbar/navbar';
import { Footer } from '../../../components/publico/footer/footer';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [Navbar, Footer],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {

}
