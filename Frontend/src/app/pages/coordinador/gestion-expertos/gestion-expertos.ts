import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinadorService } from '../../../services/coordinador/coordinador.js';
import { GestorUsuarios } from '../../../components/coordinador/gestor-usuarios/gestor-usuarios.js';

@Component({
  selector: 'app-gestion-expertos',
  standalone: true,
  imports: [CommonModule, GestorUsuarios],
  templateUrl: './gestion-expertos.html',
  styleUrl: './gestion-expertos.css',
})
export class GestionExpertos implements OnInit {
  private coordinadorSvc = inject(CoordinadorService);
  
  expertos: any[] = [];

  ngOnInit() {
      this.coordinadorSvc.expertos$.subscribe(data => {
      this.expertos = data;
    });

    this.coordinadorSvc.obtenerReporteCarga();
  }
}