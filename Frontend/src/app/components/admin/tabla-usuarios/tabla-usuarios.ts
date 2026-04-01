import { Component, inject, OnInit } from '@angular/core';
import { Admin } from '../../../services/admin/admin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-usuarios.html',
  styleUrl: './tabla-usuarios.css',
})
export class TablaUsuarios implements OnInit {
  private adminService = inject(Admin);
  usuarios: any[] = [];

ngOnInit() {
  this.adminService.usuarios$.subscribe(data => {
    this.usuarios = data;
  });

  this.adminService.obtenerUsuarios();
}
}
