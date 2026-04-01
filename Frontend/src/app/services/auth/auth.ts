import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; // Prefijo diferente al de /admin

  // 1. Validar el token que viene en la URL
  verificarInvitacion(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar-invitacion/${token}`);
  }

  // 2. Crear el usuario final (POST con password, nombre, etc)
  completarRegistro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/completar-registro`, datos);
  }
}