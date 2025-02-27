import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommonResponse,
  IActivityLog,
} from '@employee-and-department-management-system/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  private readonly apiURL = 'http://localhost:3000/api/activity-logs';

  constructor(private http: HttpClient) {}

  // Get all activities
  getActivities(
    params?: HttpParams
  ): Observable<CommonResponse<IActivityLog[]>> {
    return this.http.get<CommonResponse<IActivityLog[]>>(this.apiURL, {
      params,
    });
  }

  // Get activity by ID
  getActivityById(id: string): Observable<CommonResponse<IActivityLog>> {
    return this.http.get<CommonResponse<IActivityLog>>(`${this.apiURL}/${id}`);
  }

  // Add a new activity
  addActivity(
    activityData: IActivityLog
  ): Observable<CommonResponse<IActivityLog>> {
    return this.http.post<CommonResponse<IActivityLog>>(
      this.apiURL,
      activityData
    );
  }

  // Update an activity
  updateActivity(
    id: string,
    activityData: IActivityLog
  ): Observable<CommonResponse<IActivityLog>> {
    return this.http.patch<CommonResponse<IActivityLog>>(
      `${this.apiURL}/${id}`,
      activityData
    );
  }

  // Delete an activity
  deleteActivity(id: string): Observable<CommonResponse<null>> {
    return this.http.delete<CommonResponse<null>>(`${this.apiURL}/${id}`);
  }
}
