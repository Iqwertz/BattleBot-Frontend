import { Command } from '../editor-ide/editor-ide.component';
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
import { cloneDeep } from 'lodash-es';
import { BotCompilerService } from '../../../../services/bot-compiler.service';
import { CommandType } from '../editor-ide/editor-ide.component';
import { Store } from '@ngxs/store';
import { SetCompiledBot } from '../../../../store/app.action';
import { ConsoleService } from '../../../../services/console.service';
import { PrecompilerService } from '../../../../services/precompiler.service';

@Component({
  selector: 'app-drop-terminal',
  templateUrl: './drop-terminal.component.html',
  styleUrls: ['./drop-terminal.component.scss'],
})
export class DropTerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private botCompiler: BotCompilerService,
    private store: Store,
    private consoleService: ConsoleService,
    private preCompilerService: PrecompilerService
  ) {}

  deleteBetweenStatemen: boolean = true;
  indent: number = 40;
  undraggable: CommandType[] = ['else', 'end'];

  @Input() terminalCommands: Command[] = [];
  @Output() terminalCommandsChange = new EventEmitter<Command[]>();
  @Input()
  allowLogic: boolean = false;

  @Output() addDropRef = new EventEmitter<CdkDropList>();

  @Output() removeDropRef = new EventEmitter<CdkDropList>();

  @ViewChild('terminalList') terminalRef!: CdkDropList;

  currentDragPreviewCommands: Command[] = [];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.addDropRef.emit(this.terminalRef);
  }

  ngOnDestroy(): void {
    this.removeDropRef.emit(this.terminalRef);
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      let containerDataCopy = cloneDeep(event.container.data);
      moveItemInArray(
        containerDataCopy,
        event.previousIndex,
        event.currentIndex
      );
      this.preCompilerService.checkCommandSetValid(containerDataCopy);

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (this.currentDragPreviewCommands.length > 1) {
        event.container.data.splice(
          event.currentIndex + 1,
          0,
          ...this.currentDragPreviewCommands.slice(1)
        );
      }
    } else {
      if (!this.allowLogic) {
        if (
          this.isLogicElement(event.previousContainer.data[event.previousIndex])
        ) {
          this.consoleService.print('no Logic commands allowed!');
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
    this.store.dispatch(new SetCompiledBot(undefined));
    this.calcIndent();
  }

  dragStarted(event: any, index: number) {
    this.currentDragPreviewCommands = this.calculatePreviewCommands(index);
    this.deleteFromTerminal(index, false);
  }

  dragMoved(e: any) {
    // console.log(e);
  }

  deleteFromTerminal(index: number, includeIndex: boolean) {
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

    if (includeIndex) {
      this.terminalCommands.splice(index, 1);
    }
    this.store.dispatch(new SetCompiledBot(undefined));
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
      if (this.terminalCommands[i].indent < 0) {
        this.terminalCommands.splice(i, 1);
        this.consoleService.print('Error: invalid bracket structure');
      }
    }

    this.terminalCommandsChange.emit(this.terminalCommands);
  }

  calculatePreviewCommands(index: number): Command[] {
    let commands: Command[] = [];
    if (this.isLogicElement(this.terminalCommands[index])) {
      commands = this.getCommandsBetweenIf(this.terminalCommands.slice(index));
    } else {
      commands.push(this.terminalCommands[index]);
    }
    return commands;
  }

  getCommandsBetweenIf(commands: Command[]): Command[] {
    if (!this.botCompiler.checkIfLogicInstruction(commands[0].type)) {
      console.log('invalid CommandSet');
      return [];
    }

    let calcCommands: Command[] = [];

    let indentCounter = 0;
    for (let i = 0; i < commands.length; i++) {
      let ins: Command = commands[i];

      if (this.botCompiler.checkIfLogicInstruction(ins.type)) {
        indentCounter++;
      } else if (ins.type == 'else') {
      } else if (ins.type == 'end') {
        indentCounter--;
        if (indentCounter == 0) {
          calcCommands = commands.slice(0, i + 1);
          break;
        }
      }
    }

    return calcCommands;
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

  isCodeFunction(instruction: any) {
    return this.botCompiler.checkIfCodeFunction(instruction);
  }
}
