import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Command } from '../editor-ide/editor-ide.component';
import { _BotVars, _Operators } from '../../services/bot-compiler.service';
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

  variables = _BotVars;
  operators = _Operators;

  logicTest: LogicTest = {
    operator: this.operators[0],
    value: 'true',
    variable: this.variables[0],
  };

  whenTrueCommands = [];

  @Input() isDeletable: boolean = true;

  @Input() isPreview: boolean = true;

  @Output() onDelete = new EventEmitter<boolean>();

  @Output() logicTestData = new EventEmitter<LogicTest>();

  faDelete = faTimes;

  constructor(private botCompiler: BotCompilerService) {}

  ngOnInit(): void {
    console.log(_BotVars);
  }

  delete() {
    this.onDelete.emit(true);
  }

  isInstruction(instruction: any) {
    return this.botCompiler.checkIfDirectionInstruction(instruction.type);
  }

  logicTestChanged() {
    this.logicTestData.emit(this.logicTest);
  }
}
