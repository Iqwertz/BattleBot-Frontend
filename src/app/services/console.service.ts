import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor() {
    this.print('Bot Console')
    this.print('-v 1.0.0')
    this.print('The Output of the compiler and the simulation get printed here')
    this.print(' ')
  }

  consoleData: string[] = [''];

  private consoleDataTemp: string[] = [];
  private isPrinting: boolean = false;

  clear() {
    this.consoleData = [];
    this.consoleDataTemp = []
  }

  print(msg: string) {
    this.consoleDataTemp.push(msg);
    console.log(this.isPrinting)
    if (!this.isPrinting) {
      this.printWithDelay();
    }
  }

  private printWithDelay() {
    console.log(this.consoleDataTemp.length)
    if (this.consoleDataTemp.length > 0) {
      this.isPrinting = true;
      let char = this.consoleDataTemp[0].charAt(0);
      this.consoleData[this.consoleData.length - 1] += char
      this.consoleDataTemp[0] = this.consoleDataTemp[0].substr(1);
      if (this.consoleDataTemp[0].length == 0) {
        this.consoleDataTemp.shift();
        this.consoleData.push('')
      }
      if (this.consoleDataTemp.length > 0) {
        setTimeout(() => { this.printWithDelay() }, 10)
      } else {
        this.isPrinting = false;
      }

    } else {
      console.log("sadad")
      this.isPrinting = false;
    }
  }
}
