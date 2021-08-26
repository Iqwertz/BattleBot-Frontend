import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

/**
 *Manages alerts with matsnackbar
 *
 * @export
 * @class AlertService
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  duration = environment.alertTime * 1000;

  constructor(private _snackBar: MatSnackBar) {}

  /**
   *Trigger a snackbar with the snackbar-note class and set the given message
   *
   * @param {string} message text of the notification
   * @memberof AlertService
   */
  notification(message: string) {
    this._snackBar.open(message, 'X', {
      duration: this.duration,
      panelClass: 'snackbar-note',
    });
  }

  /**
   *Trigger a snackbar with the snackbar-error class and set the given message
   *
   * @param {string} message text of the error
   * @memberof AlertService
   */
  error(message: string) {
    this._snackBar.open(message, 'X', {
      duration: this.duration,
      panelClass: 'snackbar-error',
    });
  }
}
