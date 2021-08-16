import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Command } from '../editor-ide/editor-ide.component';
import {
  _BotVars,
  CodeFunctionData,
} from '../../services/bot-compiler.service';
import { FormControl } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dragdrop-code-function',
  templateUrl: './dragdrop-code-function.component.html',
  styleUrls: ['./dragdrop-code-function.component.scss'],
})
export class DragdropCodeFunctionComponent implements OnInit {
  constructor() {}

  botVarRefs = _BotVars;
  myControl = new FormControl();

  m: string = '';

  command: Command = {
    type: 'log',
    data: {
      message: '',
    },
    indent: 0,
  };

  faDelete = faTimes;

  @Input() set setCommand(cmd: Command) {
    this.command = cmd;
    if (cmd.data) {
      this.command.data = cmd.data;
    } else {
      this.command.data = {
        message: '',
      };
    }
  }

  @Input() isDeletable: boolean = true;

  @Input() isPreview: boolean = true;

  @Output() onDelete = new EventEmitter<boolean>();

  @Output() commandData = new EventEmitter<CodeFunctionData>();

  ngOnInit(): void {}

  messageChanged(e: any) {
    this.command.data!.message = e;
    this.commandData.emit(this.command.data);
  }

  delete() {
    this.onDelete.emit(true);
  }
}
