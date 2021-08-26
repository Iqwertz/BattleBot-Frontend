import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Player,
  FirebaseLobbyService,
} from '../../../../services/firebase/firebase-lobby.service';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../store/app.state';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
  byteColorMap = new Map(Object.entries(environment.byteColorMap));

  @Input('player') playerList: Map<string, Player> = new Map();
  @Input('admin') adminUid: string = '';

  faCheck = faCheck;
  faTimes = faTimes;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  constructor(private firebaseLobbyService: FirebaseLobbyService) {}

  ngOnInit(): void {
    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  kickPlayer(id: string) {
    this.firebaseLobbyService.kickPlayer(id);
  }

  readyChanged() {
    this.firebaseLobbyService.updatePlayer(
      this.playerList.get(this.firebaseUser.uid)
    );
  }
}
