import { Instruction } from './../../services/bot-compiler.service';
import { Component, OnInit } from '@angular/core';
import { LogicInstructionType } from '../../services/bot-compiler.service';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

export type CommandType = Instruction | LogicInstructionType;

export interface Command {
  type: CommandType;
  subCommands?: Command[];
}

@Component({
  selector: 'app-editor-ide',
  templateUrl: './editor-ide.component.html',
  styleUrls: ['./editor-ide.component.scss'],
})
export class EditorIdeComponent implements OnInit {
  constructor() {}

  left: Command = {
    type: 'left',
  };

  right: Command = {
    type: 'right',
  };

  forward: Command = {
    type: 'forward',
  };

  commands = [this.left, this.right, this.forward];

  terminal = [];

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

  deleteFromTerminal(index: number) {
    this.terminal.splice(index, 1);
  }

  ngOnInit(): void {}
}
