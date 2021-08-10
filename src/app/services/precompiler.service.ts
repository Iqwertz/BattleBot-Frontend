import { Command } from './../components/editor-ide/editor-ide.component';
import { Injectable } from '@angular/core';
import { Terminal } from '../components/editor-ide/editor-ide.component';
import {
  BrainData,
  defaultBotVars,
  InstructionSet,
  BrainFunctions,
  LogicInstruction,
  BotCompilerService,
  Instruction,
} from './bot-compiler.service';

@Injectable({
  providedIn: 'root',
})
export class PrecompilerService {
  constructor(private botCompiler: BotCompilerService) {}

  commandsToInstructionset(commands: Command[] | undefined): InstructionSet {
    let insSet: InstructionSet = { instructions: [] };
    if (!commands) {
      return insSet;
    }
    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      if (this.botCompiler.checkIfDirectionInstruction(command.type)) {
        let newIns: Instruction = command.type;
        insSet.instructions.push(newIns);
      } else if (command.type == 'if') {
        let calcCommands = this.getCommandsOfIf(commands.slice(i));
        let whenTrue: InstructionSet = this.commandsToInstructionset(
          calcCommands[0]
        );
        let newIns: LogicInstruction = {
          type: command.type,
          test: command.test!,
          whenTrue: whenTrue,
        };

        if (calcCommands[1]) {
          let whenElse = this.commandsToInstructionset(calcCommands[1]);
          newIns.else = whenElse;
        }
      }
    }
    return insSet;
  }

  /**
   *extracts the commands of an If statement list for when true and else, returns an Array of Command Arrays, in the first Element are the when True Commands in the Second the else commands (optional)
   *The first instruction of the passed Commands array has to be Logic
   *
   * @param {Command[]} commands
   * @return {*}  {Command[][]}
   * @memberof PrecompilerService
   */
  getCommandsOfIf(commands: Command[]): Command[][] {
    if (!this.botCompiler.checkIfLogicInstruction(commands[0])) {
      return [];
    }

    let whenTrue: Command[] = [];
    let whenElse: Command[] = [];

    let indentCounter = 0;
    let elseFound = -1;
    for (let i = 0; i < commands.length; i++) {
      let ins: Command = commands[i];

      if (this.botCompiler.checkIfLogicInstruction(ins)) {
        indentCounter++;
      } else if (ins.type == 'else') {
        indentCounter--;
        if (indentCounter == 0) {
          elseFound = i;
          whenTrue = commands.slice(1, i);
        }
        indentCounter++;
      } else if (ins.type == 'end') {
        indentCounter--;
        if (indentCounter == 0) {
          if (elseFound != -1) {
            whenElse = commands.slice(elseFound + 1, i);
          } else {
            whenTrue = commands.slice(1, i);
          }
          break;
        }
      }
    }

    let results: Command[][] = [whenTrue];
    if (elseFound != -1) {
      results.push(whenElse);
    }

    return results;
  }

  terminalMapToBrainData(terminals: Map<BrainFunctions, Terminal>): BrainData {
    console.log(terminals);
    console.log(terminals.get('onWallDetected')?.commands);
    let def: InstructionSet = this.commandsToInstructionset(
      terminals.get('default')?.commands
    );
    let wallDetect: InstructionSet = this.commandsToInstructionset(
      terminals.get('onWallDetected')?.commands
    );
    let trackDetect: InstructionSet = this.commandsToInstructionset(
      terminals.get('onTrackDetected')?.commands
    );

    let brainData: BrainData = {
      vars: defaultBotVars,
      default: def,
      onTrackDetected: trackDetect,
      onWallDetected: wallDetect,
    };

    return brainData;
  }
}
