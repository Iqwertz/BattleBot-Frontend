import { Component, OnInit } from '@angular/core';
import { faInfo, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../../store/app.state';
import { LobbyRef } from '../../services/firebase-lobby.service';
import { Select } from '@ngxs/store';

@Component({
  templateUrl: './bot-editor.component.html',
  styleUrls: ['./bot-editor.component.scss'],
})
export class BotEditorComponent implements OnInit {
  faInfo = faInfo;
  faTerminal = faTerminal;

  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  timeLeft: string = '';

  constructor() {}

  ngOnInit(): void {
    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
    });
    this.calcTimeLeft();
  }

  calcTimeLeft() {} //Hier weiter!
}
