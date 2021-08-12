import { Injectable } from '@angular/core';
import { Command } from '../components/editor-ide/editor-ide.component';
import { BrainFunctions } from './bot-compiler.service';

export interface Terminal {
  commands: Command[];
  allowLogic: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TerminalsService {
  terminals: Map<BrainFunctions, Terminal> = new Map();

  constructor() {
    this.terminals.set('default', {
      commands: [],
      allowLogic: false,
    });

    this.terminals.set('onWallDetected', {
      commands: [],
      allowLogic: true,
    });

    this.terminals.set('onTrackDetected', {
      commands: [],
      allowLogic: true,
    });
  }
}
