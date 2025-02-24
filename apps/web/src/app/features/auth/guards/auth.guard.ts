import { Injectable } from '@angular/core';
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> {
    if (
      this.authService.isAuthenticated() &&
      !this.authService.isTokenExpired()
    ) {
      return true;
    } else {
      this.router.navigate(['auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
