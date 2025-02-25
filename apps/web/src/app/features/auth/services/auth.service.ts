import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthResponse,
  CommonResponse,
  IIdentity,
  ILogin,
  IUser,
} from '@employee-and-department-management-system/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}
  readonly apiURL = 'http://localhost:3000/api/auth';

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      return Date.now() >= expirationTime;
    }
    return true;
  }

  // Register user
  registerUser(userData: IUser): Observable<CommonResponse<IIdentity>> {
    return this.http.post<CommonResponse<IIdentity>>(
      `${this.apiURL}/register`,
      userData
    );
  }

  // Login user
  loginUser(loginData: ILogin): Observable<CommonResponse<AuthResponse>> {
    return this.http.post<CommonResponse<AuthResponse>>(
      `${this.apiURL}/login`,
      loginData
    );
  }

  //sending token attaching to headers manually
  //   public getUserByToken(
  //     token: string,
  //   ): Observable<CommonResponse<userDetails>> {
  //     const tokenD = localStorage.getItem('token')
  //     const headers = new HttpHeaders().append(
  //       'Authorization',
  //       `Bearer ${tokenD}`,
  //     )
  //     return this.http.post<CommonResponse<userDetails>>(
  //       this.apiURL + '/currentUser',
  //       { token },
  //       { headers },
  //     )
  //   }
}
