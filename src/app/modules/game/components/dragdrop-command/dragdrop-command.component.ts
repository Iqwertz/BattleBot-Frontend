import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Command } from '../editor-ide/editor-ide.component';
import { BotCompilerService } from '../../../../services/bot-compiler.service';

import {
  faArrowUp,
  faArrowLeft,
  faArrowRight,
  IconDefinition,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dragdrop-command',
  templateUrl: './dragdrop-command.component.html',
  styleUrls: ['./dragdrop-command.component.scss'],
})
export class DragdropCommandComponent implements OnInit {
  @Input() command: Command = {
    type: 'forward',
    indent: 0,
  };

  @Input() isDeletable: boolean = true;

  @Output() onDelete = new EventEmitter<boolean>();

  iconMap: Map<string, IconDefinition> = new Map();

  variable = '';
  operator = '';
  value = '';

  constructor(private botCompiler: BotCompilerService) {}

  ngOnInit(): void {
    this.iconMap.set('left', faArrowLeft);
    this.iconMap.set('right', faArrowRight);
    this.iconMap.set('forward', faArrowUp);
    this.iconMap.set('delete', faTimes);
  }

  delete() {
    this.onDelete.emit(true);
  }

  isInstruction(ins: any) {
    return this.botCompiler.checkIfDirectionInstruction(ins);
  }
}
