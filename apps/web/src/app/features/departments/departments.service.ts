import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommonResponse,
  IDepartment,
} from '@employee-and-department-management-system/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly apiURL = 'http://localhost:3000/api/departments';

  constructor(private http: HttpClient) {}

  // Get all departments
  getDepartments(params:HttpParams): Observable<CommonResponse<IDepartment[]>> {
    return this.http.get<CommonResponse<IDepartment[]>>(this.apiURL, {
      params: params
    });
  }
  

  // Get department by ID
  getDepartmentById(id: string): Observable<CommonResponse<IDepartment>> {
    return this.http.get<CommonResponse<IDepartment>>(`${this.apiURL}/${id}`);
  }

  // Add a new department
  addDepartment(
    departmentData: IDepartment
  ): Observable<CommonResponse<IDepartment>> {
    return this.http.post<CommonResponse<IDepartment>>(
      this.apiURL,
      departmentData
    );
  }

  // Update a department
  updateDepartment(
    id: string,
    departmentData: IDepartment
  ): Observable<CommonResponse<IDepartment>> {
    return this.http.patch<CommonResponse<IDepartment>>(
      `${this.apiURL}/${id}`,
      departmentData
    );
  }

  // Delete a department
  deleteDepartment(id: string): Observable<CommonResponse<null>> {
    return this.http.delete<CommonResponse<null>>(`${this.apiURL}/${id}`);
  }
}
