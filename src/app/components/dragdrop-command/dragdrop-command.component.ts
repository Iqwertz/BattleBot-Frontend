import { Component, Input, OnInit } from '@angular/core';
import { Command } from '../editor-ide/editor-ide.component';

@Component({
  selector: 'app-dragdrop-command',
  templateUrl: './dragdrop-command.component.html',
  styleUrls: ['./dragdrop-command.component.scss'],
})
export class DragdropCommandComponent implements OnInit {
  @Input() command: Command = {
    type: 'forward',
  };

  constructor() {}

  ngOnInit(): void {}
}
