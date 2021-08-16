import { ConsoleService } from './console.service';
import { Command } from './../components/editor-ide/editor-ide.component';
import { Injectable } from '@angular/core';
import { Terminal } from './terminals.service';
import { CodeFunction } from './bot-compiler.service';
import {
  BrainData,
  defaultBotVars,
  InstructionSet,
  BrainFunctions,
  LogicInstruction,
  BotCompilerService,
  Instruction,
} from './bot-compiler.service';

export interface CalculatedIfCommands {
  endIndex: number;
  whenTrue: Command[];
  whenElse: Command[];
}

@Injectable({
  providedIn: 'root',
})
export class PrecompilerService {
  constructor(
    private botCompiler: BotCompilerService,
    private consoleService: ConsoleService
  ) {}

  compileError = false;

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
      } else if (this.botCompiler.checkIfCodeFunction(command)) {
        if (command.type == 'log') {
          insSet.instructions.push(command);
        }
      } else if (command.type == 'if') {
        if (!command.test) {
          console.log('error: Logic Command without test');
          this.consoleService.print('Error: Logic Command without test');
        } else {
          let calcCommands = this.getCommandsOfIf(commands.slice(i));
          if (calcCommands.endIndex != -1) {
            let whenTrue: InstructionSet = this.commandsToInstructionset(
              calcCommands.whenTrue
            );
            let newIns: LogicInstruction = {
              type: command.type,
              test: command.test,
              whenTrue: whenTrue,
            };

            if (calcCommands.whenElse.length > 0) {
              let whenElse = this.commandsToInstructionset(
                calcCommands.whenElse
              );
              newIns.else = whenElse;
            }

            insSet.instructions.push(newIns);

            i += calcCommands.endIndex;
          } else {
            console.log('no end index');
          }
        }
      } else {
        console.log(command);
      }
    }
    return insSet;
  }

  /**
   *extracts the commands of an If statement list for when true and else,
   *returns an Array of Command Arrays and a Number,
   *in the first Element is the Index of the last end statement,
   *in the second Element are the when True Commands,
   *in the third Element the else commands (optional)
   *The first instruction of the passed Commands array has to be Logic
   *
   *
   * @param {(Command[] | number)[]} commands
   * @return {*}  {Command[][]}
   * @memberof PrecompilerService
   */
  getCommandsOfIf(commands: Command[]): CalculatedIfCommands {
    if (!this.botCompiler.checkIfLogicInstruction(commands[0].type)) {
      console.log('invalid CommandSet');
      this.consoleService.print('Error: Invalid CommandSet');
      return {
        endIndex: -1,
        whenElse: [],
        whenTrue: [],
      };
    }

    let whenTrue: Command[] = [];
    let whenElse: Command[] = [];

    console.log(commands);

    let endIndex: number = -1;
    let indentCounter: number = 0;
    let elseFound: number = -1;
    for (let i = 0; i < commands.length; i++) {
      let ins: Command = commands[i];

      if (this.botCompiler.checkIfLogicInstruction(ins.type)) {
        indentCounter++;
      } else if (ins.type == 'else') {
        indentCounter--;
        if (indentCounter == 0) {
          if (elseFound == -1) {
            elseFound = i;
            whenTrue = commands.slice(1, i);
          } else {
            this.consoleService.print('Error: Double else inside if loop');
            this.compileError = true;
          }
        }
        indentCounter++;
      } else if (ins.type == 'end') {
        indentCounter--;
        if (indentCounter == 0) {
          endIndex = i;
          if (elseFound != -1) {
            whenElse = commands.slice(elseFound + 1, i);
          } else {
            whenTrue = commands.slice(1, i);
          }
          break;
        }
      }
    }

    let results: CalculatedIfCommands = {
      endIndex: endIndex,
      whenTrue: whenTrue,
      whenElse: whenElse,
    };

    return results;
  }

  terminalMapToBrainData(
    terminals: Map<BrainFunctions, Terminal>
  ): BrainData | undefined {
    this.compileError = false;
    this.consoleService.print('compiling default...');
    let def: InstructionSet = this.commandsToInstructionset(
      terminals.get('default')?.commands
    );
    if (def.instructions.length == 0) {
      def.instructions.push('forward');
    }
    if (this.checkError()) {
      return;
    }
    this.consoleService.print('compiling onWallDetected...');
    let wallDetect: InstructionSet = this.commandsToInstructionset(
      terminals.get('onWallDetected')?.commands
    );
    if (this.checkError()) {
      return;
    }
    this.consoleService.print('compiling onTrackDetected...');
    let trackDetect: InstructionSet = this.commandsToInstructionset(
      terminals.get('onTrackDetected')?.commands
    );
    if (this.checkError()) {
      return;
    }

    let brainData: BrainData = {
      vars: defaultBotVars,
      default: def,
      onTrackDetected: trackDetect,
      onWallDetected: wallDetect,
    };

    this.consoleService.print('Compiling successfull...');
    return brainData;
  }

  private checkError(): boolean {
    if (this.compileError) {
      this.consoleService.print('Compiling faild!');
      return true;
    }
    return false;
  }

  checkCommandSetValid(cmdSet: Command[]): boolean {
    if (this.checkBrackets(cmdSet)) {
      return true;
    }
    return false;
  }

  private checkBrackets(cmdSet: Command[]): boolean {
    let indent = 0;
    for (let i = 0; i < cmdSet.length; i++) {
      let ins: Command = cmdSet[i];
      if (this.botCompiler.checkIfLogicInstruction(ins.type)) {
        indent++;
      } else if (ins.type == 'end') {
        indent--;
      }
    }
    if (indent == 0) {
      return true;
    } else {
      return false;
    }
  }
}
