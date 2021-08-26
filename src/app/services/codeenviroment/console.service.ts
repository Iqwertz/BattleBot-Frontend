import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  constructor() {
    this.print('Bot Console');
    this.print('-v 1.0.0');
    this.print(
      'The Output of the compiler and the simulation get printed here'
    );
    this.print(' ');
  }

  printDelay = 10;
  currentPrintDelay = this.printDelay;

  private scrollToBottom = new Subject<any>();
  scrollToBottom$ = this.scrollToBottom.asObservable();

  consoleData: string[] = [''];

  private consoleDataTemp: string[] = [];
  private isPrinting: boolean = false;

  clear() {
    this.consoleData = [];
    this.consoleDataTemp = [];
  }

  print(msg: string) {
    this.consoleDataTemp.push(msg);
    if (!this.isPrinting) {
      this.printWithDelay();
    }
  }

  private printWithDelay() {
    if (this.consoleDataTemp.length > 6) {
      this.currentPrintDelay = 0;
    } else {
      this.currentPrintDelay = this.printDelay;
    }
    if (this.consoleDataTemp.length > 0) {
      this.isPrinting = true;
      let char = this.consoleDataTemp[0].charAt(0);
      this.consoleData[this.consoleData.length - 1] += char;
      this.consoleDataTemp[0] = this.consoleDataTemp[0].substr(1);
      if (this.consoleDataTemp[0].length == 0) {
        this.consoleDataTemp.shift();
        this.consoleData.push('');
        this.scrollToBottom.next();
      }
      if (this.consoleDataTemp.length > 0) {
        setTimeout(() => {
          this.printWithDelay();
        }, this.currentPrintDelay);
      } else {
        this.isPrinting = false;
      }
    } else {
      this.isPrinting = false;
    }
  }
}
