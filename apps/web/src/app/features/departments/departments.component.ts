import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { PageEvent } from '@angular/material/paginator';
import {
  CHIP_TYPES,
  DEPARTMENT_TYPE,
} from '@employee-and-department-management-system/enums';
import {
  chipData,
  IDepartment,
} from '@employee-and-department-management-system/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchContainerComponent } from '../../components/search-container/search-container.component';
import { DepartmentService } from './departments.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-departments',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SearchContainerComponent,
  ],
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  departments: IDepartment[] = [];

  inputFields: chipData[] = [
    {
      label: 'Name',
      type: CHIP_TYPES.TEXT,
      key: 'name',
      value: '',
      placeHolder: 'Finance',
    },
    {
      label: 'Type',
      type: CHIP_TYPES.DROPDOWN,
      key: 'type',
      value: '',
      placeHolder: 'Iron',
      options: Object.values(DEPARTMENT_TYPE),
    },
  ];

  pagedDepartments: IDepartment[] = [];
  totalDepartments = 0;
  pageSize = 10;
  pageIndex = 0;

  searchQuery: { [key: string]: string } = {};
  queryParams: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private departmentService: DepartmentService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = { ...params };

      if (params['_id']) {
        this.searchQuery['_id'] = params['_id'];
        this.getAllDepartments();
      }
    });
    this.getAllDepartments();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllDepartments();
  }

  getAllDepartments() {
    let httpParams = new HttpParams()
      .set('start', (this.pageIndex * this.pageSize).toString())
      .set('size', this.pageSize.toString());

    Object.keys(this.searchQuery).forEach((key) => {
      if (this.searchQuery[key]) {
        httpParams = httpParams.set(key, this.searchQuery[key]);
      }
    });

    this.departmentService.getDepartments(httpParams).subscribe({
      next: (res) => {
        this.pagedDepartments = res?.data;
        this.totalDepartments = res?.count ?? res?.data?.length;
      },
      error: (updatedErr) => {
        console.log('Error fetching updated departments:', updatedErr);
      },
    });
  }

  handleSearchQuery(query: { [key: string]: string }) {
    this.searchQuery = query;
    this.getAllDepartments();
  }

  addDepartment() {
    this.router.navigate(['/app/departments/add']);
  }
}
