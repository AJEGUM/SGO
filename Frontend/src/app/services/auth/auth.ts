import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Importación de la librería

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; 

  // --- MÉTODOS EXISTENTES ---
  verificarInvitacion(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar-invitacion/${token}`);
  }

  getGoogleAuthUrl(tokenInvitacion?: string): string {
    const baseUrl = `${this.apiUrl}/google`;
    return tokenInvitacion ? `${baseUrl}?token=${tokenInvitacion}` : baseUrl;
  }

  // --- LÓGICA DE SESIÓN PARA EL GUARD ---

  // Obtiene el token guardado después del login exitoso
  getToken(): string | null {
    return localStorage.getItem('tokenSGO');
  }

  // Decodifica el payload del JWT para obtener el rol y datos del usuario
  getUsuarioActual(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      // jwtDecode extrae el JSON que Passport firmó en el Backend
      // El objeto devuelto tendrá: { id, rol, nombre, email, ... }
      const decoded: any = jwtDecode(token);
      
      // Mapeamos el campo 'rol' al nombre que espera tu Guard: 'rol_id'
      return {
        ...decoded,
        rol_id: decoded.rol // Ajusta esto según el nombre que uses en jwt.sign() del backend
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
}