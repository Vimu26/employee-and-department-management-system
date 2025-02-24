import { Route } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './features/auth/guards/auth.guard';

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
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
  },
  {
    path: 'employees',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/employees/employees.routes').then(
        (m) => m.employeesRoutes
      ),
  },
  {
    path: 'departments',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/departments/departments.routes').then(
        (m) => m.departmentsRoutes
      ),
  },
  {
    path: 'activities',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/activities/activities.routes').then(
        (m) => m.activitiesRoutes
      ),
  },
  { path: '**', component: NotFoundComponent },
];
