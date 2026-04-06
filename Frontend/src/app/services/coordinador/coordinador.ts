import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CoordinadorService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/coordinador`;

  private expertosSubject = new BehaviorSubject<any[]>([]);
  expertos$ = this.expertosSubject.asObservable();

  obtenerReporteCarga() {
    return this.http.get<any>(`${this.url}/expertos`).pipe(
      map(res => res.ok ? res.data : []),
      tap(data => this.expertosSubject.next(data))
    ).subscribe();
  }
}