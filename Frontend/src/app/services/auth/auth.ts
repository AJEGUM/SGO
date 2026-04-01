import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; 

  // 1. Validar el token que viene en la URL (Se mantiene igual)
  verificarInvitacion(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar-invitacion/${token}`);
  }

  // 2. Registro Clásico (Si decides dejarlo)
  completarRegistro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/completar-registro`, datos);
  }

  // 3. NUEVO: Registro con Google OAuth 2.0
  // Recibe el token de Google y el token de la invitación de la URL
  completarRegistroGoogle(tokenGoogle: string, tokenInvitacion: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/completar-registro-google`, {
      tokenGoogle,
      tokenInvitacion
    });
  }
}