import { LobbyRef } from '../../../../services/firebase/firebase-lobby.service';
import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../store/app.state';

@Component({
  selector: 'app-editor-info',
  templateUrl: './editor-info.component.html',
  styleUrls: ['./editor-info.component.scss'],
})
export class EditorInfoComponent implements OnInit {
  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  constructor() {}

  ngOnInit(): void {
    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }
}
