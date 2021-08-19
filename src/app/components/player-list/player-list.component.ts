import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Player } from '../../services/firebase-lobby.service';
import { Select } from '@ngxs/store';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
  @Input('player') playerList: Map<string, Player> = new Map();
  @Input('admin') adminUid: string = '';

  faCheck = faCheck;
  faTimes = faTimes;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  constructor() {}

  ngOnInit(): void {
    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  kickPlayer(id: string) {
    console.log(id);
  }
}
