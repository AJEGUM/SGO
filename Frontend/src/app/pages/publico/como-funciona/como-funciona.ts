import { Component } from '@angular/core';
import { Navbar } from '../../../components/publico/navbar/navbar';
import { Footer } from '../../../components/publico/footer/footer';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [Navbar, Footer],
  templateUrl: './como-funciona.html',
  styleUrl: './como-funciona.css',
})
export class ComoFunciona {

}
