import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Command } from '../editor-ide/editor-ide.component';
import {
  LogicTest,
  BotCompilerService,
} from '../../services/bot-compiler.service';
import {
  CdkDragDrop,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dragdrop-logic-command',
  templateUrl: './dragdrop-logic-command.component.html',
  styleUrls: ['./dragdrop-logic-command.component.scss'],
})
export class DragdropLogicCommandComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() command: Command = {
    type: 'if',
  };

  logicTest: LogicTest = {
    operator: '==',
    value: 'true',
    variable: 'radarForward',
  };

  whenTrueCommands = [];

  @Input() isDeletable: boolean = true;

  @Input() isPreview: boolean = true;

  @Output() onDelete = new EventEmitter<boolean>();

  @Output() addDropRef = new EventEmitter<CdkDropList>();

  @Output() removeDropRef = new EventEmitter<CdkDropList>();

  @ViewChild('dropList') dropListRef?: CdkDropList;

  faDelete = faTimes;

  constructor(private botCompiler: BotCompilerService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.addDropRef.emit(this.dropListRef);
  }

  delete() {
    this.onDelete.emit(true);
  }

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

  deleteFromTerminal(index: number, dropType: string) {
    if (dropType == 'whenTrue') {
      this.whenTrueCommands.splice(index, 1);
    } else if (dropType == 'else') {
    }
  }

  isInstruction(instruction: any) {
    return this.botCompiler.checkIfDirectionInstruction(instruction.type);
  }

  addDropField(ref: CdkDropList) {
    this.addDropRef.emit(ref);
  }

  removeDropField(ref: CdkDropList) {
    this.removeDropRef.emit(ref);
  }

  ngOnDestroy(): void {
    this.removeDropRef.emit(this.dropListRef);
  }
}
