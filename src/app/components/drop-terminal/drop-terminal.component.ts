import { Command } from './../editor-ide/editor-ide.component';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { cloneDeep } from 'lodash';
import { BotCompilerService } from '../../services/bot-compiler.service';

@Component({
  selector: 'app-drop-terminal',
  templateUrl: './drop-terminal.component.html',
  styleUrls: ['./drop-terminal.component.scss'],
})
export class DropTerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private botCompiler: BotCompilerService) {}

  deleteBetweenStatemen: boolean = true;
  indent: number = 40;

  @Input() terminalCommands: Command[] = [];
  @Output() terminalCommandsChange = new EventEmitter<Command[]>();
  @Input()
  allowLogic: boolean = false;

  @Output() addDropRef = new EventEmitter<CdkDropList>();

  @Output() removeDropRef = new EventEmitter<CdkDropList>();

  @ViewChild('terminalList') terminalRef!: CdkDropList;
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.addDropRef.emit(this.terminalRef);
  }

  ngOnDestroy(): void {
    this.removeDropRef.emit(this.terminalRef);
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (!this.allowLogic) {
        if (
          this.isLogicElement(event.previousContainer.data[event.previousIndex])
        ) {
          return;
        }
      }

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

  deleteFromTerminal(index: number) {
    if (this.isLogic(this.terminalCommands[index])) {
      let indentCounter = 0;
      for (let i = index + 1; i < this.terminalCommands.length; i++) {
        let ins: Command = this.terminalCommands[i];

        if (this.isLogic(ins)) {
          indentCounter++;
        } else if (ins.type == 'end') {
          if (indentCounter == 0) {
            if (this.deleteBetweenStatemen) {
              this.terminalCommands.splice(index + 1, i - index);
            } else {
              this.terminalCommands.splice(i, 1);
            }
            break;
          } else {
            indentCounter--;
          }
        }
      }
    }

    this.terminalCommands.splice(index, 1);

    this.calcIndent();
  }

  calcIndent() {
    let currentIndent = 0;
    for (let i = 0; i < this.terminalCommands.length; i++) {
      let ins: Command = this.terminalCommands[i];
      if (this.isLogic(ins)) {
        this.terminalCommands[i].indent = currentIndent;
        currentIndent += this.indent;
      } else if (ins.type == 'end') {
        currentIndent -= this.indent;
        this.terminalCommands[i].indent = currentIndent;
      } else if (ins.type == 'else') {
        this.terminalCommands[i].indent = currentIndent - this.indent;
      } else {
        this.terminalCommands[i].indent = currentIndent;
      }
    }

    this.terminalCommandsChange.emit(this.terminalCommands);
  }

  isLogicElement(instruction: any): boolean {
    if (
      this.isLogic(instruction) ||
      instruction.type == 'end' ||
      instruction.type == 'else'
    ) {
      return true;
    }

    return false;
  }

  isLogic(instruction: any) {
    return this.botCompiler.checkIfLogicInstruction(instruction.type);
  }
}
