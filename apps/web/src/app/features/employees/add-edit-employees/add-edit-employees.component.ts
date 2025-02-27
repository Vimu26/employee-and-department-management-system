import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import {
  JOB_POSITION,
  EMPLOYEE_STATUS,
} from '@employee-and-department-management-system/enums';
import { EmployeesService } from '../employees.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../common/services/files.service';
import { SnackbarService } from '../../../common/services/snackbar.service';
import { DepartmentService } from '../../departments/departments.service';
import { IDepartmentsKeyValues, IEmployee } from '@employee-and-department-management-system/interfaces';

@Component({
  selector: 'app-add-edit-employees',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-edit-employees.component.html',
  styleUrl: './add-edit-employees.component.scss',
})
export class AddEditEmployeesComponent implements OnInit {
  employeeForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    no: new FormControl('', Validators.required),
    street1: new FormControl('', Validators.required),
    street2: new FormControl(''),
    city: new FormControl('', Validators.required),
    province: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    epf_no: new FormControl(''),
    nic: new FormControl('', Validators.required),
    profile_pic: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    department_id: new FormControl('', Validators.required),
  });

  jobPositions = Object.values(JOB_POSITION);
  employeeStatuses = Object.values(EMPLOYEE_STATUS);
  departments: IDepartmentsKeyValues[] = [];

  empId: string | null = null;
  selectedFile: File | null = null;
  isUploading = false;
  fileName = '';
  fileError = '';

  constructor(
    private employeeService: EmployeesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private fileService: FileService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
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
        this.snackbarService.success('File uploaded successfully!');
      },
      error: (err) => {
        this.isUploading = false;
        this.fileError = 'File upload failed. Please try again.';
        this.snackbarService.error('File upload failed. Please try again.');
      },
    });
  }

  onCancel() {
    //
  }

  loadDepartments(): void {
    this.departmentService.getDepartmentList().subscribe({
      next: (res) => {
        console.log('dep', res?.data);
        this.departments = res.data;
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
      },
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      const employeePayload: IEmployee = {
        name: {
          first_name: formValue.first_name ?? '',
          last_name: formValue.last_name ?? '',
        },
        address: {
          no: formValue.no ?? '',
          street1: formValue.street1 ?? '',
          street2: formValue.street2 ?? '',
          city: formValue.city ?? '',
          province: formValue.province ?? '',
          country: formValue.country ?? '',
        },
        epf_no: formValue.epf_no ?? '',
        nic: formValue.nic ?? '',
        profile_pic: this.fileName,
        email: formValue.email ?? '',
        phone: formValue.phone ?? '',
        position: (formValue.position as JOB_POSITION) ?? '',
        department_id: formValue.department_id ?? '',
      };

      this.employeeService.addEmployee(employeePayload).subscribe({
        next: (res) => {
          this.router.navigate(['/app/employees'])
        },
        error: (err) => {
          console.error('Error adding employee:', err);
        },
      });
    }
  }

  cancel() {
    this.employeeForm.reset();
  }
}
