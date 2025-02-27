import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommonResponse,
  IEmployee,
} from '@employee-and-department-management-system/interfaces';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private readonly apiURL = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  // Get all employees
  getEmployees(params: HttpParams): Observable<CommonResponse<IEmployee[]>> {
    return this.http.get<CommonResponse<IEmployee[]>>(this.apiURL, { params });
  }

  // Get employee by ID
  getEmployeeById(id: string): Observable<CommonResponse<IEmployee>> {
    return this.http.get<CommonResponse<IEmployee>>(`${this.apiURL}/${id}`);
  }

  // Add a new employee
  addEmployee(employeeData: IEmployee): Observable<CommonResponse<IEmployee>> {
    return this.http.post<CommonResponse<IEmployee>>(this.apiURL, employeeData);
  }

  // Update an employee
  updateEmployee(
    id: string,
    employeeData: IEmployee
  ): Observable<CommonResponse<IEmployee>> {
    return this.http.patch<CommonResponse<IEmployee>>(
      `${this.apiURL}/${id}`,
      employeeData
    );
  }

  // Delete an employee
  deleteEmployee(id: string): Observable<CommonResponse<null>> {
    return this.http.delete<CommonResponse<null>>(`${this.apiURL}/${id}`);
  }
}
