import { Route } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('./features/dashboard/dashboard.routes').then((m) => m.routes),
  // },
  // {
  //   path: 'employees',
  //   loadChildren: () =>
  //     import('./features/employees/employees.routes').then((m) => m.routes),
  // },
  // {
  //   path: 'departments',
  //   loadChildren: () =>
  //     import('./features/departments/departments.routes').then((m) => m.routes),
  // },
  // {
  //   path: 'activities',
  //   loadChildren: () =>
  //     import('./features/employees/dashboard.routes').then((m) => m.routes),
  // },
  { path: '**', component: NotFoundComponent },
];
