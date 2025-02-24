import { Routes } from '@angular/router';

export const activitiesRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    loadComponent: () =>
      import('./activities.component').then((m) => m.ActivitiesComponent),
  },
];
