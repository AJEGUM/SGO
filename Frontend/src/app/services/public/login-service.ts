import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly AUTH_URL = `${environment.apiUrl}/auth/google`;

  private readonly PERFIL_URL = `${environment.apiUrl}/auth/perfil`;
  
  private usuarioSignal = signal<any>(null);

  constructor(private http: HttpClient) { }

  redirectToGoogle(): void {
    window.location.href = this.AUTH_URL;
  }

  async verificarPerfil(): Promise<any> {
    try {
      const res = await firstValueFrom(this.http.get<any>(this.PERFIL_URL));
      
      if (res && res.ok) {
        this.usuarioSignal.set(res.usuario);
        return res.usuario;
      }
      return null;
    } catch (error) {
      this.limpiarSesion();
      return null;
    }
  }

  establecerUsuario(usuario: any) {
    this.usuarioSignal.set(usuario);
  }

  obtenerUsuarioActual() {
    return this.usuarioSignal();
  }

  limpiarSesion() {
    this.usuarioSignal.set(null);
  }
}