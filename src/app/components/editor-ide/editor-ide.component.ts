import { Instruction } from './../../services/bot-compiler.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  BotCompilerService,
  LogicTest,
} from '../../services/bot-compiler.service';
import { LogicInstructionType } from '../../services/bot-compiler.service';
import { CdkDropList } from '@angular/cdk/drag-drop';

export type FunctionTypes = 'end' | 'else';
export type CommandType = Instruction | LogicInstructionType | FunctionTypes;

export interface Command {
  type: CommandType;
  indent: number;
  test?: LogicTest;
}

export interface Terminal {
  commands: Command[];
  allowLogic: boolean;
}

@Component({
  selector: 'app-editor-ide',
  templateUrl: './editor-ide.component.html',
  styleUrls: ['./editor-ide.component.scss'],
})
export class EditorIdeComponent implements OnInit, AfterViewInit {
  constructor(private botCompiler: BotCompilerService) {}

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

  end: Command = {
    type: 'end',
    indent: 0,
  };

  commands = [
    this.left,
    this.right,
    this.forward,
    this.if,
    this.else,
    this.end,
  ];

  terminals: Map<string, Terminal> = new Map();

  @ViewChild('terminalList') terminalListRef?: CdkDropList;

  commandsConnectedLists: CdkDropList[] = [];

  ngOnInit(): void {
    this.terminals.set('default', {
      commands: [],
      allowLogic: false,
    });

    this.terminals.set('onObstacleDetected', {
      commands: [],
      allowLogic: true,
    });

    this.terminals.set('onTrackDetected', {
      commands: [],
      allowLogic: true,
    });
  }

  ngAfterViewInit(): void {
    this.commandsConnectedLists.push(this.terminalListRef!);
  }

  addDropField(ref: CdkDropList) {
    this.commandsConnectedLists.push(ref);
    console.log(this.commandsConnectedLists);
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
}
