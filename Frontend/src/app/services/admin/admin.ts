import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface InvitacionData {
  email: string;
  rol_id: number;
}

export interface Competencia {
  id: number;
  codigo_norma: string;
  prefijo_id: string;
  nombre: string;
  duracion_horas: number;
  created_at?: string;
}
export interface Rol {
  id: number;
  nombre_rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private apiUrl = `${environment.apiUrl}/admin`; 
  private usuariosSubject = new BehaviorSubject<any[]>([]);
  usuarios$ = this.usuariosSubject.asObservable();  

  constructor(private http: HttpClient) { }

  uploadCurriculo(archivo: File, infoFicha: any): Observable<any> {
    const formData = new FormData();
    
    formData.append('archivo', archivo); 
    
    formData.append('info', JSON.stringify(infoFicha)); 

    return this.http.post(`${this.apiUrl}/upload-curriculo`, formData);
  }

  getCompetencias(programaId: number): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(`${this.apiUrl}/programas/${programaId}/competencias`);
  }

  getDetalleCompetencia(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/competencias/detalle/${id}`);
  }

  getProgramas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/programas`);
  }

  patchCurriculo(tipo: string, id: number, nuevoTexto: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/patch/${tipo}/${id}`, { valor: nuevoTexto });
  }

  enviarInvitacion(data: InvitacionData): Observable<any> {
    return this.http.post(`${this.apiUrl}/invitar`, data).pipe(
      tap(() => this.obtenerUsuarios())
    );
  }

  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }

  obtenerUsuarios(): void {
    this.http.get<any[]>(`${this.apiUrl}/usuarios`).subscribe({
      next: (res) => this.usuariosSubject.next(res), // Notifica el cambio a todos
      error: (err) => console.error('Error al traer usuarios', err)
    });
  }
}
