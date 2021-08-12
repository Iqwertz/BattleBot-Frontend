import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor() {
    this.print('Bot Console')
    this.print('-v 1.0.0')
    this.print('The Output of the compiler and the simulation get printed here')
    this.print('')
  }

  consoleData: string[] = [];

  clear() {
    this.consoleData = []
  }

  print(msg: string) {
    this.consoleData.push(msg);
  }
}
