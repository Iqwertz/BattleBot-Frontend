import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  LobbyRef,
  FirebaseLobbyService,
} from '../../services/firebase-lobby.service';

@Component({
  selector: 'app-public-lobbys',
  templateUrl: './public-lobbys.component.html',
  styleUrls: ['./public-lobbys.component.scss'],
})
export class PublicLobbysComponent implements OnInit {
  lobbys: Map<string, LobbyRef> = new Map();

  constructor(
    private db: AngularFireDatabase,
    private fireBaseLobbyService: FirebaseLobbyService
  ) {
    let lobbyFirebaseRef = db.object('lobbys').valueChanges();
    lobbyFirebaseRef.subscribe((changes: any) => {
      this.lobbys = this.fireBaseLobbyService.jsonToMap(changes);
      console.log(this.lobbys);
    });
  }

  ngOnInit(): void {}
}
