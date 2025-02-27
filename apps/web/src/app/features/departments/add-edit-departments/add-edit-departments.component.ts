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
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../departments.service';
import { IDepartment } from '@employee-and-department-management-system/interfaces';

@Component({
  selector: 'app-add-edit-departments',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-edit-departments.component.html',
  styleUrl: './add-edit-departments.component.scss',
})
export class AddEditDepartmentsComponent implements OnInit {
  departmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  departmentTypes = Object.values(DEPARTMENT_TYPE);
  departmentId: string | null = null;

  constructor(
    private router: Router,
    private departmentService: DepartmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.departmentId = params.get('id');
      if (this.departmentId) {
        this.loadDepartmentDetails(this.departmentId);
      }
    });
  }

  async loadDepartmentDetails(id: string) {
    this.departmentService.getDepartmentById(id).subscribe({
      next: (department) => {
        this.departmentForm.patchValue({
          name: department?.data?.name,
          type: department?.data?.type,
          description: department?.data?.description,
        });
      },
      error: (error) => {
        console.log('Error fetching department:', error);
      },
    });
  }

  save() {
    if (this.departmentForm.valid) {
      const department: IDepartment = {
        name: this.departmentForm.controls.name.value ?? '',
        type:
          (this.departmentForm.controls.type.value as DEPARTMENT_TYPE) ?? '',
        description: this.departmentForm.controls.description.value ?? '',
      };
      if (!this.departmentId) {
        this.departmentService.addDepartment(department).subscribe({
          next: (res) => {
            this.router.navigate(['app/departments'], {
              queryParams: {
                _id: res?.data?._id?.toString(),
              },
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.departmentService
          .updateDepartment(this.departmentId, department)
          .subscribe({
            next: (res) => {
              this.router.navigate(['app/departments'], {
                queryParams: {
                  _id: res?.data?._id?.toString(),
                },
              });
            },
            error: (err) => {
              console.log('Error updating department:', err);
            },
          });
      }
    }
  }

  cancel() {
    this.router.navigate(['app/departments']);
  }
}
