import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DEPARTMENT_TYPE } from '@employee-and-department-management-system/enums';
import { Router } from '@angular/router';
import { DepartmentService } from '../departments.service';
import { IDepartment } from '@employee-and-department-management-system/interfaces';

@Component({
  selector: 'app-add-edit-departments',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-edit-departments.component.html',
  styleUrl: './add-edit-departments.component.scss',
})
export class AddEditDepartmentsComponent {
  departmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  departmentTypes = Object.values(DEPARTMENT_TYPE);

  constructor(
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  save() {
    if (this.departmentForm.valid) {
      const department: IDepartment = {
        name: this.departmentForm.controls.name.value ?? '',
        type:
          (this.departmentForm.controls.type.value as DEPARTMENT_TYPE) ?? '',
        description: this.departmentForm.controls.description.value ?? '',
      };
      this.departmentService.addDepartment(department).subscribe({
        next: (res) => {
          this.router.navigate(['app/departments'], {
            queryParams: {
              _id: res?.data?._id,
            },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['app/departments']);
  }
}
