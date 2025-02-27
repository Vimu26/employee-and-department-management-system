import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivitiesService } from './activities.service';
import {
  IActivityLog,
  IUser,
} from '@employee-and-department-management-system/interfaces';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-activities',
  imports: [CommonModule, MaterialModule],
  standalone: true,
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
})
export class ActivitiesComponent implements OnInit {
  activities: IActivityLog[] = [];
  loading = false;
  errorMessage = '';
  totalActivities = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    this.fetchActivities();
  }

  fetchActivities(): void {
    this.loading = true;
    const httpParams = new HttpParams()
      .set('start', (this.pageIndex * this.pageSize).toString())
      .set('size', this.pageSize.toString());
    this.activitiesService.getActivities(httpParams).subscribe({
      next: (response) => {
        console.log(response);
        this.activities = response.data ?? [];
        this.totalActivities = response?.count ?? response?.data?.length;
        this.getActivities();
        this.getActivitiesCount();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load activities';
        console.error('Error fetching activities:', error);
        this.loading = false;
      },
    });
  }

  getCreatedName(data: any) {
    return data?.createdByUser?.name?.first_name
      ? `${data?.createdByUser?.name?.first_name} ${data?.createdByUser?.name?.last_name}`
      : '-';
  }

  getLastModifiedName(data: any) {
    return data?.lastModifiedByUser?.name?.first_name
      ? `${data?.lastModifiedByUser?.name?.first_name} ${data?.lastModifiedByUser?.name?.last_name}`
      : '-';
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchActivities();
  }

  deleteActivity(id: string): void {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activitiesService.deleteActivity(id).subscribe({
        next: () => {
          this.activities = this.activities.filter((act) => act._id !== id);
        },
        error: (error) => {
          console.error('Error deleting activity:', error);
        },
      });
    }
  }

  getActivities() {
    return this.activities ?? [];
  }

  getActivitiesCount() {
    return this.totalActivities ?? 0;
  }
}
