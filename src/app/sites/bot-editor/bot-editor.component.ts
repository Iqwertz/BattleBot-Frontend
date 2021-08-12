import { Component, OnInit } from '@angular/core';
import { faInfo, faTerminal } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './bot-editor.component.html',
  styleUrls: ['./bot-editor.component.scss'],
})
export class BotEditorComponent implements OnInit {
  faInfo = faInfo;
  faTerminal = faTerminal;

  constructor() {}

  ngOnInit(): void {}
}
