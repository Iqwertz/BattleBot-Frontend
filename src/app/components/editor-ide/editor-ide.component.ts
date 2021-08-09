import { Instruction } from './../../services/bot-compiler.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BotCompilerService } from '../../services/bot-compiler.service';
import {
  LogicInstructionType,
  LogicInstruction,
} from '../../services/bot-compiler.service';
import {
  CdkDragDrop,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

export type CommandType = Instruction | LogicInstructionType;

export interface Command {
  type: CommandType;
  logicInstruction?: LogicInstruction;
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
  };

  right: Command = {
    type: 'right',
  };

  forward: Command = {
    type: 'forward',
  };

  if: Command = {
    type: 'if',
  };

  commands = [this.left, this.right, this.forward, this.if];

  terminal = [this.if];

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
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
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
    this.terminal.splice(index, 1);
  }

  isInstruction(instruction: any) {
    return this.botCompiler.checkIfDirectionInstruction(instruction.type);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.commandsConnectedLists.push(this.terminalListRef!);
  }
}
