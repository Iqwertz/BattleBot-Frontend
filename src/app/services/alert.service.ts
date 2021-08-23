import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  duration = environment.alertTime * 1000;

  constructor(private _snackBar: MatSnackBar) {}

  notification(message: string) {
    console.log(message);
    this._snackBar.open(message, 'X', {
      duration: this.duration,
      panelClass: 'snackbar-note',
    });
  }

  error(message: string) {
    this._snackBar.open(message, 'X', {
      duration: this.duration,
      panelClass: 'snackbar-error',
    });
  }
}
