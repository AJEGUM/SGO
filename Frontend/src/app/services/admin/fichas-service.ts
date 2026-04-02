import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Ficha {
  id?: number;
  numero_ficha: string;
  programa_id: number;
  nombre_programa_vinculado?: string;
  fecha_inicio: string;
  fecha_fin: string;
}

@Injectable({
  providedIn: 'root'
})
export class FichasService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getFichas(): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(`${this.apiUrl}/fichas`);
  }

  getFichasPorPrograma(programaId: number): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(`${this.apiUrl}/programas/${programaId}/fichas`);
  }

  crearFicha(ficha: Ficha): Observable<any> {
    return this.http.post(`${this.apiUrl}/fichas`, ficha);
  }
}