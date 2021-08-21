import { Player, LobbyRef } from './firebase-lobby.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  lobbyFirebaseRef;
  lobbys: Map<string, LobbyRef> = new Map();

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private store: Store) {

    this.lobbyFirebaseRef = db.object('lobbys').valueChanges();
    this.lobbyFirebaseRef.subscribe((changes: any) => {
      if (changes) {
        changes.player = this.formatPlayerToMap(changes.player);
        this.lobbys = this.jsonToMap(changes);
      }
    });
  }

  formatPlayerToMap(obj: any): Map<string, Player> {
    let map = new Map();
    for (const key in obj) {
      map.set(key, obj[key]);
    }
    return map;
  }

  jsonToMap(json: any): Map<string, any> {
    let map = new Map();
    for (let key in json) {
      map.set(key, json[key]);
    }
    return map;
  }
}
