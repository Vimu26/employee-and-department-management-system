import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../common/services/snackbar.service';
import { DepartmentService } from '../departments/departments.service';
import {
  chipData,
  IDepartmentsKeyValues,
  IEmployee,
} from '@employee-and-department-management-system/interfaces';
import {
  CHIP_TYPES,
  EMPLOYEE_STATUS,
  JOB_POSITION,
} from '@employee-and-department-management-system/enums';
import { HttpParams } from '@angular/common/http';
import { EmployeesService } from './employees.service';
import { FileService } from '../../common/services/files.service';
import { SearchContainerComponent } from '../../components/search-container/search-container.component';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, MaterialModule, SearchContainerComponent],
  standalone: true,
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: IEmployee[] = [];
  totalEmployees = 0;
  pageSize = 10;
  pageIndex = 0;

  inputFields: chipData[] = [
    {
      label: 'Employee ID',
      type: CHIP_TYPES.TEXT,
      key: 'employee_id',
      value: '',
      placeHolder: 'EMP0016',
    },
    {
      label: 'First Name',
      type: CHIP_TYPES.TEXT,
      key: 'f_name',
      value: '',
      placeHolder: 'John',
    },
    {
      label: 'Position',
      type: CHIP_TYPES.DROPDOWN,
      key: 'position',
      value: '',
      placeHolder: 'Manager',
      options: Object.values(JOB_POSITION),
    },
    {
      label: 'Status',
      type: CHIP_TYPES.DROPDOWN,
      key: 'status',
      value: '',
      placeHolder: 'ACTIVE',
      options: Object.values(EMPLOYEE_STATUS),
    },
    {
      label: 'Department Name',
      type: CHIP_TYPES.TEXT,
      key: 'name',
      value: '',
      placeHolder: 'Finance',
    },
  ];

  searchQuery: { [key: string]: string } = {};
  queryParams: { [key: string]: string } = {};
  departments: IDepartmentsKeyValues[] = [];

  constructor(
    private router: Router,
    private departmentService: DepartmentService,
    private activatedRoute: ActivatedRoute,
    private snackBar: SnackbarService,
    private employeeService: EmployeesService,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = { ...params };

      if (params['_id']) {
        this.searchQuery['_id'] = params['_id'];
        this.getAllEmployees();
      }
    });
    this.getAllEmployees();
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

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllEmployees();
  }

  getAllEmployees() {
    let httpParams = new HttpParams()
      .set('start', (this.pageIndex * this.pageSize).toString())
      .set('size', this.pageSize.toString());

    Object.keys(this.searchQuery).forEach((key) => {
      if (this.searchQuery[key]) {
        httpParams = httpParams.set(key, this.searchQuery[key]);
      }
    });

    this.employeeService.getEmployees(httpParams).subscribe({
      next: (res) => {
        this.employees = res?.data;
        this.totalEmployees = res?.count ?? res?.data?.length;
        this.loadDepartments();
      },
      error: (updatedErr) => {
        console.log('Error fetching updated employees:', updatedErr);
      },
    });
  }

  getDepartmentName(id: string) {
    return (
      this.departments?.find(
        (department) => department?._id?.toString() === id?.toString()
      )?.name ?? '-'
    );
  }

  handleSearchQuery(query: { [key: string]: string }) {
    this.searchQuery = query;
    this.getAllEmployees();
  }

  getProfilePic(name: string): string {
    return !name || name.trim() === ''
      ? 'https://i.pinimg.com/736x/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg'
      : this.fileService.generateFileUrlByFileName(name);
  }

  addEmployee() {
    this.router.navigate(['/app/employees/add']);
  }

  editEmployee(employee: IEmployee) {
    if (!employee?._id) return;
    this.router.navigate([`/app/employees/edit/${employee?._id}`]);
  }

  deleteEmployee(employee: IEmployee, index: number) {
    if (employee?._id) {
      this.employeeService.deleteEmployee(employee._id.toString()).subscribe({
        next: () => {
          this.employees.splice(index, 1);
          this.getAllEmployees();
          this.snackBar.success('Employee Deleted Successfully!');
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        },
      });
    }
  }

  toggleStatus(employee: any, event: any) {
    employee.status = event.checked ? 'ACTIVE' : 'INACTIVE';
  }
}
