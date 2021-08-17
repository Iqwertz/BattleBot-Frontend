import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../services/firebase-lobby.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
  @Input('player') playerList: Map<string, Player> = new Map();
  @Input('admin') adminUid: string = '';

  constructor() {}

  ngOnInit(): void {
    console.log(this.playerList.size);
  }
}
