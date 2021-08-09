import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Command } from '../editor-ide/editor-ide.component';
import {
  LogicTest,
  BotCompilerService,
} from '../../services/bot-compiler.service';

@Component({
  selector: 'app-dragdrop-logic-command',
  templateUrl: './dragdrop-logic-command.component.html',
  styleUrls: ['./dragdrop-logic-command.component.scss'],
})
export class DragdropLogicCommandComponent implements OnInit {
  @Input() command: Command = {
    type: 'if',
    indent: 0,
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

  faDelete = faTimes;

  constructor(private botCompiler: BotCompilerService) {}

  ngOnInit(): void {}

  delete() {
    this.onDelete.emit(true);
  }

  isInstruction(instruction: any) {
    return this.botCompiler.checkIfDirectionInstruction(instruction.type);
  }
}
