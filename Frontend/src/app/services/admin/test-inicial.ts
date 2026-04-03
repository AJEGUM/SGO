import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TestInicial {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }


  checkTestInicial(fichaId: number, competenciaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/evaluaciones/check?fichaId=${fichaId}&competenciaId=${competenciaId}`);
  }

  generarConIA(config: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ia/generar-evaluacion`, config);
  }

  guardarTestFinal(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/evaluaciones/guardar`, datos);
  }
  
}
