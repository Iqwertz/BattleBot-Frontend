import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  confettiEvent = new EventEmitter();

  constructor() {}

  setConfetti() {
    this.confettiEvent.emit();
  }
}
