import { Instruction } from './../../services/bot-compiler.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  BotCompilerService,
  LogicTest,
} from '../../services/bot-compiler.service';
import { LogicInstructionType } from '../../services/bot-compiler.service';
import {
  CdkDragDrop,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { cloneDeep } from 'lodash';

export type FunctionTypes = 'end' | 'else';
export type CommandType = Instruction | LogicInstructionType | FunctionTypes;

export interface Command {
  type: CommandType;
  indent: number;
  test?: LogicTest;
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

  terminal: Command[] = [];

  deleteBetweenStatemen: boolean = true;

  indent: number = 40;

  @ViewChild('terminalList') terminalListRef?: CdkDropList;

  commandsConnectedLists: CdkDropList[] = [];

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const clone = cloneDeep(
        event.previousContainer.data[event.previousIndex]
      );
      event.container.data.splice(event.currentIndex, 0, clone);

      if (event.previousContainer.data[event.previousIndex].type == 'if') {
        event.container.data.splice(event.currentIndex + 1, 0, { type: 'end' });
      }
    }
    this.calcIndent();
  }

  addDropField(ref: CdkDropList) {
    this.commandsConnectedLists.push(ref);
    console.log(this.commandsConnectedLists);
  }

  removeDropField(ref: CdkDropList) {
    let i = this.commandsConnectedLists.indexOf(ref);
    this.commandsConnectedLists.splice(i, 1);
  }

  deleteFromTerminal(index: number) {
    if (this.isLogic(this.terminal[index])) {
      let indentCounter = 0;
      for (let i = index + 1; i < this.terminal.length; i++) {
        let ins: Command = this.terminal[i];
        console.log(ins);

        if (this.isLogic(ins)) {
          indentCounter++;
        } else if (ins.type == 'end') {
          if (indentCounter == 0) {
            if (this.deleteBetweenStatemen) {
              this.terminal.splice(index + 1, i - index);
            } else {
              this.terminal.splice(i, 1);
            }
            break;
          } else {
            indentCounter--;
          }
        }
      }
    }

    this.terminal.splice(index, 1);

    this.calcIndent();
  }

  isInstruction(instruction: any) {
    return this.botCompiler.checkIfDirectionInstruction(instruction.type);
  }

  isLogic(instruction: any) {
    return this.botCompiler.checkIfLogicInstruction(instruction.type);
  }

  calcIndent() {
    let currentIndent = 0;
    for (let i = 0; i < this.terminal.length; i++) {
      let ins: Command = this.terminal[i];
      console.log(currentIndent);
      if (this.isLogic(ins)) {
        console.log('isLogic');
        console.log(this.terminal);
        this.terminal[i].indent = currentIndent;
        console.log(this.terminal);
        currentIndent += this.indent;
        console.log(this.terminal);
      } else if (ins.type == 'end') {
        console.log('end');
        currentIndent -= this.indent;
        this.terminal[i].indent = currentIndent;
      } else if (ins.type == 'else') {
        console.log('else');
        this.terminal[i].indent = currentIndent - this.indent;
      } else {
        this.terminal[i].indent = currentIndent;
      }

      console.log(currentIndent);
    }

    console.log(this.terminal);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.commandsConnectedLists.push(this.terminalListRef!);
  }
}
