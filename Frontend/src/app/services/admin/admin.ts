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

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private apiUrl = `${environment.apiUrl}/admin`; 

  constructor(private http: HttpClient) { }

  uploadCurriculo(archivo: File): Observable<any> {
    const formData = new FormData();
    // 'archivo' debe ser igual al nombre en upload.single('archivo') del backend
    formData.append('archivo', archivo); 

    return this.http.post(`${this.apiUrl}/upload-curriculo`, formData);
  }

  getCompetencias(): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(`${this.apiUrl}/competencias`);
  }

  // Obtener detalle completo (RAPs, Saberes, etc.)
  getDetalleCompetencia(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/competencias/${id}`);
  }
}
