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
import {
  IDepartmentsKeyValues,
  IEmployee,
} from '@employee-and-department-management-system/interfaces';

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
    this.route.paramMap.subscribe((params) => {
      this.empId = params.get('id');
      if (this.empId) {
        this.loadEmployeeDetails(this.empId);
      }
    });
  }

  loadEmployeeDetails(employeeId: string): void {
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (res) => {
        if (res.data?._id) {
          const employee = res.data;
          this.employeeForm.patchValue({
            first_name: employee.name.first_name,
            last_name: employee.name.last_name,
            no: employee.address.no,
            street1: employee.address.street1,
            street2: employee.address.street2,
            city: employee.address.city,
            province: employee.address.province,
            country: employee.address.country,
            epf_no: employee.epf_no,
            nic: employee.nic,
            profile_pic: employee.profile_pic,
            email: employee.email,
            phone: employee.phone,
            position: employee.position,
            department_id: employee.department_id,
          });

          this.fileName = employee.profile_pic ?? '';
        }
      },
      error: (err) => {
        console.error('Error fetching employee details:', err);
      },
    });
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

      if (this.empId) {
        this.employeeService
          .updateEmployee(this.empId, employeePayload)
          .subscribe({
            next: (res) => {
              this.snackbarService.success('Employee updated successfully!');
              this.router.navigate(['/app/employees']);
            },
            error: (err) => {
              console.error('Error updating employee:', err);
              this.snackbarService.error('Error updating employee.');
            },
          });
      } else {
        this.employeeService.addEmployee(employeePayload).subscribe({
          next: (res) => {
            this.snackbarService.success('Employee added successfully!');
            this.router.navigate(['/app/employees'], {
              queryParams: { _id: this.empId },
            });
          },
          error: (err) => {
            console.error('Error adding employee:', err);
            this.snackbarService.error('Error adding employee.');
          },
        });
      }
    }
  }

  cancel() {
    this.employeeForm.reset();
  }
}
