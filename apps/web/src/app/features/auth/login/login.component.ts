import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { Router, RouterModule } from '@angular/router';
import { SnackbarService } from '../../../common/services/snackbar.service';
import { AuthService } from '../services/auth.service';
import { ILogin } from '@employee-and-department-management-system/interfaces';

export interface LoginFormGroup {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}
@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private snackBar: SnackbarService,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = new FormGroup<LoginFormGroup>({
    username: new FormControl<string | null>('', Validators.required),
    password: new FormControl<string | null>('', Validators.required),
  });

  onLogin() {
    if (this.loginForm.valid) {
      const loginData: ILogin = {
        username: this.loginForm.value.username ?? '',
        password: this.loginForm.value.password ?? '',
      };

      this.authService.loginUser(loginData).subscribe({
        next: (response) => {
          if (response?.data) {
            console.log(response);
            this.router.navigate(['/app/launchpad']);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem(
              'user',
              JSON.stringify({
                ...response?.data?.user,
                password: undefined,
              })
            );
          } else {
            this.snackBar.error(response?.message);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
