import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IFiles } from '@employee-and-department-management-system/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = `${environment.API_URL}/api/files`;

  constructor(private http: HttpClient) {
    console.log(environment.API_URL);
  }

  uploadFile(file: File): Observable<IFiles> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<IFiles>(`${this.apiUrl}/upload`, formData);
  }

  getFiles(): Observable<IFiles[]> {
    return this.http.get<IFiles[]>(`${this.apiUrl}`);
  }

  generateFileUrlByFileName(filename: string): string {
    return `${environment.API_URL}/uploads/${filename}`;
  }
}
