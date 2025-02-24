import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}
  readonly apiURL = 'http://localhost:3000/auth';

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
      try {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        );
        const expirationTime = payload.exp * 1000;
        return Date.now() >= expirationTime;
      } catch (error) {
        console.error('Invalid token:', error);
        return true;
      }
    }
    return true;
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
