import { Routes } from '@angular/router';

export const employeesRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    loadComponent: () =>
      import('./employees.component').then((m) => m.EmployeesComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-edit-employees/add-edit-employees.component').then(
        (m) => m.AddEditEmployeesComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./add-edit-employees/add-edit-employees.component').then(
        (m) => m.AddEditEmployeesComponent
      ),
  },
];
