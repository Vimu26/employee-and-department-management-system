import { Route } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { LaunchpadComponent } from './features/launchpad/launchpad.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/app/launchpad',
    pathMatch: 'full',
  },
  {
    path: 'app',
    redirectTo: '/app/launchpad',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'app',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'launchpad',
        component: LaunchpadComponent,
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./features/employees/employees.routes').then(
            (m) => m.employeesRoutes
          ),
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('./features/departments/departments.routes').then(
            (m) => m.departmentsRoutes
          ),
      },
      {
        path: 'activities',
        loadChildren: () =>
          import('./features/activities/activities.routes').then(
            (m) => m.activitiesRoutes
          ),
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
