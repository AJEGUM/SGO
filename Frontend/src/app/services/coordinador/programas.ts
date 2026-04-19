import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/coordinador`;

  // Para el dropdown del coordinador
  getProgramasSelector(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/selector`, { withCredentials: true });
  }

  // Para ver la "columna vertebral" antes de crear la semilla
  getEstructuraPrograma(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/estructura`, { withCredentials: true });
  }
}
