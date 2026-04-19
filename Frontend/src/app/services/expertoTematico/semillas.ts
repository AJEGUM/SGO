import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SemillasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/expertoTematico`;

  // Signal para almacenar las semillas y consumirlas en los componentes
  public semillas = signal<any[]>([]);
  public cargando = signal<boolean>(false);

  obtenerMisSemillas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-semillas`, { 
      withCredentials: true 
    });
  }
}
