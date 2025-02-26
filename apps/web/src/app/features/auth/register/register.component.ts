import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { USER_ROLES } from '@employee-and-department-management-system/enums';
import { IUser } from '@employee-and-department-management-system/interfaces';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../../../common/services/snackbar.service';
import { FileService } from '../../../common/services/files.service';

export interface RegisterFormData {
  first_name: FormControl<string | null>;
  last_name: FormControl<string | null>;
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  user_role: FormControl<string | null>;
  password: FormControl<string | null>;
  profile_pic: FormControl<string | null>;
  address_no: FormControl<string | null>;
  address_street1: FormControl<string | null>;
  address_street2: FormControl<string | null>;
  address_city: FormControl<string | null>;
  address_province: FormControl<string | null>;
  address_country: FormControl<string | null>;
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    private fileService: FileService
  ) {}

  registerForm = new FormGroup<RegisterFormData>({
    first_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    user_role: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    profile_pic: new FormControl(null),
    address_no: new FormControl('', [Validators.required]),
    address_street1: new FormControl('', [Validators.required]),
    address_street2: new FormControl(''),
    address_city: new FormControl('', [Validators.required]),
    address_province: new FormControl('', [Validators.required]),
    address_country: new FormControl('', [Validators.required]),
  });

  userRoles = Object.values(USER_ROLES);
  selectedFile: File | null = null;
  isUploading = false;
  fileName = '';
  fileError = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      // Reset any previous error
      this.fileError = '';
      this.selectedFile = file;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.fileError = 'Please select a file first.';
      return;
    }

    this.isUploading = true;
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.fileName = res?.filename;
        console.log('File uploaded successfully', res);
        // this.snackBar.open('File uploaded successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.isUploading = false;
        console.error('File upload failed', err);
        this.fileError = 'File upload failed. Please try again.';
        // this.snackBar.open('File upload failed. Please try again.', 'Close', { duration: 3000 });
      },
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      const registerPayload: IUser = {
        username: formData.username ?? '',
        name: {
          first_name: formData.first_name ?? '',
          last_name: formData.last_name ?? '',
        },
        email: formData.email ?? '',
        password: formData.password ?? '',
        role: (formData.user_role as USER_ROLES) ?? '',
        profile_pic: this.fileName,
        address: {
          no: formData.address_no ?? '',
          street1: formData.address_street1 ?? '',
          street2: formData.address_street2 ?? '',
          city: formData.address_city ?? '',
          province: formData.address_province ?? '',
          country: formData.address_country ?? '',
        },
      };
      console.log(registerPayload);
      this.authService.registerUser(registerPayload).subscribe({
        next: (res) => {
          if (res.data) {
            console.log(res);
            this.router.navigate(['/auth/login']);
          } else {
            console.log(res);
            this.snackbarService.error(res?.message ?? '');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
