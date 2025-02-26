import { Routes } from '@angular/router';

export const departmentsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    loadComponent: () =>
      import('./departments.component').then((m) => m.DepartmentsComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-edit-departments/add-edit-departments.component').then(
        (m) => m.AddEditDepartmentsComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./add-edit-departments/add-edit-departments.component').then(
        (m) => m.AddEditDepartmentsComponent
      ),
  },
];
