// snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  success(message: string, duration = 5000) {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['success-snackbar'],
    };
    this._snackBar.open(message, '', config);
  }

  error(message: string, duration = 5000) {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['error-snackbar'],
    };
    this._snackBar.open(message, '', config);
  }
}
