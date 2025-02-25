import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { USER_ROLES } from '@employee-and-department-management-system/enums';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
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
    address_no: new FormControl('', [Validators.required]),
    address_street1: new FormControl('', [Validators.required]),
    address_street2: new FormControl(''),
    address_city: new FormControl('', [Validators.required]),
    address_province: new FormControl('', [Validators.required]),
    address_country: new FormControl('', [Validators.required]),
  });

  userRoles = Object.values(USER_ROLES);

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      const registerPayload = {
        username: formData.username,
        name: {
          first_name: formData.first_name,
          last_name: formData.last_name,
        },
        email: formData.email,
        password: formData.password,
        role: formData.user_role,
        address: {
          no: formData.address_no,
          street1: formData.address_street1,
          street2: formData.address_street2,
          city: formData.address_city,
          province: formData.address_province,
          country: formData.address_country,
        },
      };

      console.log(registerPayload); 
    }
  }
}
