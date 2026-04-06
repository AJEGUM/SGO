import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Importación de la librería
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`; 

  // --- MÉTODOS EXISTENTES ---
  verificarInvitacion(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar-invitacion/${token}`);
  }

  getGoogleAuthUrl(tokenInvitacion?: string): string {
    const baseUrl = `${this.apiUrl}/google`;
    return tokenInvitacion ? `${baseUrl}?token=${tokenInvitacion}` : baseUrl;
  }

  getToken(): string | null {
    return localStorage.getItem('tokenSGO');
  }

  // Decodifica el payload del JWT para obtener el rol y datos del usuario
  getUsuarioActual(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      
      return {
        ...decoded,
        rol_id: decoded.rol
      };
    } catch (error) {
      console.error("Token inválido o corrupto", error);
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('tokenSGO');
    window.location.href = '/';
  }

  public redirigirSegunRol(rolId: number): void {
    const rutas: Record<number, string> = {
      1: '/admin/importar',
      2: '/coordinador/gestion-de-expertos',
      3: '/instructor/dashboard',
      4: '/pedagogo/revision',
      5: '/disenador/multimedia'
    };

    const destino = rutas[rolId] || '/';
    this.router.navigate([destino]);
  }
}