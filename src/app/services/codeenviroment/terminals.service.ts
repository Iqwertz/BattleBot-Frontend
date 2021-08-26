import { Injectable, OnDestroy } from '@angular/core';
import { Command } from '../../modules/game/components/editor-ide/editor-ide.component';
import { BrainFunctions } from '../compiler/bot-compiler.service';
import { Select } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import { Bot } from '../../modules/game/components/battle-map/battle-map.component';

export interface Terminal {
  commands: Command[];
  allowLogic: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TerminalsService {
  @Select(AppState.compiledBot) compiledBot$: any;

  terminals: Map<BrainFunctions, Terminal> = new Map();

  constructor() {
    let savedTerminals = localStorage.getItem('lastTerminal');
    if (savedTerminals) {
      this.terminals = JSON.parse(savedTerminals, this.reviver);
    }

    this.checkAllTerminals();

    this.compiledBot$.subscribe((b: Bot | undefined) => {
      localStorage.setItem(
        'lastTerminal',
        JSON.stringify(this.terminals, this.replacer)
      );
    });
  }

  private checkAllTerminals() {
    if (!this.terminals.has('default')) {
      this.terminals.set('default', {
        commands: [],
        allowLogic: false,
      });
    }
    if (!this.terminals.has('onWallDetected')) {
      this.terminals.set('onWallDetected', {
        commands: [],
        allowLogic: true,
      });
    }
    if (!this.terminals.has('onTrackDetected')) {
      this.terminals.set('onTrackDetected', {
        commands: [],
        allowLogic: true,
      });
    }
    if (!this.terminals.has('onOwnTrackDetected')) {
      this.terminals.set('onOwnTrackDetected', {
        commands: [],
        allowLogic: true,
      });
    }
  }

  /////From: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
  private replacer(key: string, value: any) {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  private reviver(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
}
