import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    loadComponent: () =>
      import('./launchpad.component').then((m) => m.LaunchpadComponent),
  },
];
