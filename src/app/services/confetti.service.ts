import { Injectable, EventEmitter } from '@angular/core';

/**
 *service to trigger the confetti event
 *
 * @export
 * @class ConfettiService
 */
@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  confettiEvent = new EventEmitter();

  constructor() {}

  setConfetti() {
    //triggers the confetti emitter
    this.confettiEvent.emit();
  }
}
