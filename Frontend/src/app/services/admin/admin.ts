import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  // Servicio para subir el archivo excel al sistema (backend)
  uploadCurriculo(archivo: File, infoFicha: any): Observable<any> {
    const formData = new FormData();
    
    // Agregamos el archivo
    formData.append('archivo', archivo); 
    
    // Agregamos el objeto de la ficha como string JSON
    formData.append('info', JSON.stringify(infoFicha)); 

    return this.http.post(`${this.apiUrl}/upload-curriculo`, formData);
  }

  uploadDisenoPdf(archivo: File, programaId: number): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', archivo); // 'pdf' debe coincidir con upload.single('pdf') en el backend
    return this.http.post(`${this.apiUrl}/programas/procesar-pdf/${programaId}`, formData);
  }

  // Ahora recibe el ID como parámetro
  getCompetencias(programaId: number): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(`${this.apiUrl}/programas/${programaId}/competencias`);
  }

  // Obtiene los RAPs y detalles (Ruta 2)
  getDetalleCompetencia(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/competencias/detalle/${id}`);
  }

  // En admin.service.ts
  getProgramas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/programas`);
  }

  // Servicio para actualizar la data de las competencias
  patchCurriculo(tipo: string, id: number, nuevoTexto: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/patch/${tipo}/${id}`, { valor: nuevoTexto });
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }
}
