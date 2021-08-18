import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store, Select } from '@ngxs/store';
import { SetFirebaseUser } from '../store/app.action';
import { AppState } from '../store/app.state';
import { GameModes } from './simulation.service';
import { NumberSymbol } from '@angular/common';

export interface Player {
  uId: string;
  name: string;
}

export interface ObstacleSettings {
  threshold: number;
  octaveCount: number;
  amplitude: number;
  persistence: number;
}

export interface LobbyRefSettings {
  editorTime: number;
  id: string;
  name: string;
  private: boolean;
  simulationTime: number;
  maxPlayer: number;
  mode: GameModes;
  speed: number;
  mapSize: number;
  obstacleSettings: ObstacleSettings;
}

export interface LobbyRef {
  settings: LobbyRefSettings;
  player: Map<string, Player>;
  adminUid: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseLobbyService {
  lobbyFirebaseRef;
  lobbys: Map<string, LobbyRef> = new Map();

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private store: Store
  ) {
    this.lobbyFirebaseRef = db.object('lobbys').valueChanges();
    this.lobbyFirebaseRef.subscribe((changes: any) => {
      if (changes) {
        changes.player = this.formatPlayerToMap(changes.player);
        this.lobbys = this.jsonToMap(changes);
      }
    });

    auth.onAuthStateChanged((user) => {
      this.store.dispatch(new SetFirebaseUser(user));
      if (!user) {
        console.log('user logged out');
        router.navigate(['']);
      }
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });

    //auth.signOut();
  }

  generateNewLobby() {
    console.log('newLobby');
    if (!this.firebaseUser) {
      this.auth
        .signInAnonymously()
        .then(() => {
          let id = this.getNewSessionId(5);

          let player: Player = {
            uId: this.firebaseUser.uid,
            name: environment.roboNames[
              Math.floor(Math.random() * environment.roboNames.length)
            ],
          };

          let settings: LobbyRefSettings = {
            editorTime: environment.defaultLobby.editorTime,
            id: id,
            maxPlayer: environment.defaultLobby.maxPlayer,
            name: '',
            private: environment.defaultLobby.private,
            simulationTime: environment.defaultLobby.simulationTime,
            mode: 'Color',
            mapSize: environment.defaultMapSize[0],
            obstacleSettings: environment.obstacleNoiseSettings,
            speed: 20,
          };

          console.log(this.firebaseUser.uid);

          let newLobby: LobbyRef = {
            settings: settings,
            adminUid: this.firebaseUser.uid,
            player: new Map(),
          };

          console.log(newLobby);

          console.log('set lobbys');
          this.db.database
            .ref()
            .child('/lobbys')
            .child(id)
            .update(newLobby)
            .then(() => {
              console.log('set player');
              this.db.database
                .ref()
                .child('/lobbys/' + id + '/player')
                .child(player.uId)
                .update(player)
                .then(() => {
                  this.router.navigate(['createLobby', id]);
                });
            });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    } else {
      console.log('Error: already in a game');
    }
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

  getNewSessionId(digits: number) {
    //generates a new unique session id
    let generatedId: string = this.getRandomId(digits, false, true, false);
    while (this.lobbys.has(generatedId)) {
      //check if id already exists and regenerate a new one until it is unique
      generatedId = this.getRandomId(digits, true, true, false);
    }

    return generatedId;
  }

  /**
   *generates a random String fitting the given conditions
   *
   * @param {number} digits the length of the Id
   * @param {boolean} numbers can the Id have numbers
   * @param {boolean} capitalLetter can the Id have capital letters
   * @param {boolean} letter can the Id have lower case letters
   * @return {*}  {string}
   * @memberof FirebaseLobbyService
   */
  getRandomId(
    digits: number,
    numbers: boolean,
    capitalLetter: boolean,
    letter: boolean
  ): string {
    const nChar = '0123456789';
    const cChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lChar = 'abcdefghijklmnopqrstuvwxyz';

    var characters = numbers ? nChar : '';
    characters += capitalLetter ? cChar : '';
    characters += letter ? lChar : '';

    var result = '';
    var charactersLength = characters.length;
    for (let i: number = 0; i < digits; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
