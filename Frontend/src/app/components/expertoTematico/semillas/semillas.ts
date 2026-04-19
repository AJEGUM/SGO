import { Component, inject, OnInit } from '@angular/core'; // Añadimos OnInit
import { SemillasService } from '../../../services/expertoTematico/semillas';
import { LoginService } from '../../../services/public/login-service'; // Importa tu servicio de login
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-semillasComponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './semillas.html',
  styleUrl: './semillas.css',
})
export class SemillasComponent implements OnInit {
  // Inyectamos ambos servicios
  public semillaService = inject(SemillasService);
  private loginService = inject(LoginService);

  ngOnInit(): void {
    // Validamos perfil para asegurar que el backend reconozca la sesión de Passport
    this.loginService.getProfile().subscribe({
      next: (res) => {
        if (res && res.autenticado) {
          // Solo si estamos autenticados, pedimos las semillas
          this.semillaService.obtenerMisSemillas().subscribe();
        }
      },
      error: (err) => {
        console.error('Error de autenticación al cargar semillas:', err);
      }
    });
  }
}