import { TerminalsService } from '../../../../services/terminals.service';
import { Instruction } from '../../../../services/bot-compiler.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  BotCompilerService,
  LogicTest,
} from '../../../../services/bot-compiler.service';
import {
  LogicInstructionType,
  BrainFunctions,
} from '../../../../services/bot-compiler.service';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { PrecompilerService } from '../../../../services/precompiler.service';
import {
  CodeFunctionType,
  CodeFunctionData,
} from '../../../../services/bot-compiler.service';

export type FunctionTypes = 'end' | 'else';
export type CommandType =
  | Instruction
  | LogicInstructionType
  | FunctionTypes
  | CodeFunctionType;

export interface Command {
  type: CommandType;
  indent: number;
  test?: LogicTest;
  data?: CodeFunctionData;
}

@Component({
  selector: 'app-editor-ide',
  templateUrl: './editor-ide.component.html',
  styleUrls: ['./editor-ide.component.scss'],
})
export class EditorIdeComponent implements OnInit, AfterViewInit {
  constructor(
    private botCompiler: BotCompilerService,
    private preCompiler: PrecompilerService,
    public terminalService: TerminalsService
  ) {
    console.log(terminalService.terminals);
  }

  left: Command = {
    type: 'left',
    indent: 0,
  };

  right: Command = {
    type: 'right',
    indent: 0,
  };

  forward: Command = {
    type: 'forward',
    indent: 0,
  };

  if: Command = {
    type: 'if',
    indent: 0,
  };

  else: Command = {
    type: 'else',
    indent: 0,
  };

  log: Command = {
    type: 'log',
    indent: 0,
  };

  commands = [
    this.left,
    this.right,
    this.forward,
    this.log,
    this.if,
    this.else,
  ];

  @ViewChild('terminalList') terminalListRef?: CdkDropList;

  commandsConnectedLists: CdkDropList[] = [];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.commandsConnectedLists.push(this.terminalListRef!);
  }

  preCompileTerminals() {
    let result = this.preCompiler.terminalMapToBrainData(
      this.terminalService.terminals
    );
    console.log(result);
  }

  addDropField(ref: CdkDropList) {
    this.commandsConnectedLists.push(ref);
  }

  removeDropField(ref: CdkDropList) {
    let i = this.commandsConnectedLists.indexOf(ref);
    this.commandsConnectedLists.splice(i, 1);
  }

  isInstruction(instruction: any) {
    return this.botCompiler.checkIfDirectionInstruction(instruction.type);
  }

  isLogic(instruction: any) {
    return this.botCompiler.checkIfLogicInstruction(instruction.type);
  }

  isCodeFunction(instruction: any) {
    return this.botCompiler.checkIfCodeFunction(instruction);
  }
}
