import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestor-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestor-usuarios.html',
  styleUrl: './gestor-usuarios.css',
})
export class GestorUsuarios {
  @Input() expertos: any[] = [];
}