import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/importar`;

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);

    return this.http.post(this.apiUrl, formData);
  }
}