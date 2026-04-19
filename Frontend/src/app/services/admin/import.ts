import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Programa {
  programa_id: number;
  codigo: string;
  nombre: string;
  denominacion: string;
  version: string;
  nivel_formacion: string;
}

export interface EstructuraRapPayload {
  proceso: string;
  saber: string;
  criterio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  subirExcel(archivo: File): Observable<any> {
    const datosFormulario = new FormData();
    datosFormulario.append('archivo', archivo);

    // Aquí usamos la ruta de importación específica
    return this.http.post(`${this.apiUrl}/importar`, datosFormulario);
  }

  obtenerProgramas(): Observable<Programa[]> {
    return this.http.get<Programa[]>(`${this.apiUrl}/listarProgramas`);
  }

  // GET /api/admin/:id/detalle
  obtenerDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/detalle`);
  }

  guardarDetallesRap(rapId: number, datos: EstructuraRapPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rap/${rapId}/estructura`, datos, {
      withCredentials: true // Importante si manejas sesiones con cookies/passport
    });
  }

  eliminarDetallesRap(rapId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/rap/${rapId}/detalles`, {
      withCredentials: true
    });
  }
}