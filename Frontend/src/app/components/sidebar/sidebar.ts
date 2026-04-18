import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/public/login-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuOption {
  label: string;
  icon: string;
  route: string;
  roles: number[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
authService = inject(LoginService);
  
  // Lista maestra de navegación basada en tus roles de la DB
  readonly menuOptions: MenuOption[] = [
    { label: 'Inicio', icon: 'home', route: '/', roles: [1,2,3,4,5,6] },
    { label: 'Importar Excel', icon: 'upload', route: '/importar', roles: [5] },
    { label: 'Gestión Usuarios', icon: 'users', route: '/usuarios', roles: [5] },
    { label: 'Mi Perfil', icon: 'user', route: '/perfil', roles: [1,2,3,4,6] },
    { label: 'Panel Instructor', icon: 'school', route: '/dashboard/instructor', roles: [2] },
    { label: 'Panel Aprendiz', icon: 'book', route: '/dashboard/aprendiz', roles: [1] },
    { label: 'Coordinación', icon: 'admin_panel_settings', route: '/dashboard/coordinador', roles: [4] }
  ];

  // Filtramos las opciones según el rol del usuario actual
  menuFiltrado: MenuOption[] = [];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.menuFiltrado = this.menuOptions.filter(option => 
        option.roles.includes(user.rol_id)
      );
    }
  }

  logout() {
    this.authService.logout();
  }
}
