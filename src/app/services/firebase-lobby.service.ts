import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store, Select } from '@ngxs/store';
import { SetFirebaseUser } from '../store/app.action';
import { AppState } from '../store/app.state';
import { GameModes } from './simulation.service';

export interface Player {
  uId: string;
  name: string;
  isReady: boolean;
  colorId: number;
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
  obstacles: boolean;
  gameStarted: boolean;
  editorEndTimeStamp: Date;
}

export interface LobbyRef {
  settings: LobbyRefSettings;
  player: Map<string, Player>;
  adminUid: string;
}

export interface GameEntry {
  playerBots: Map<string, GameBotEntry>;
  obstacleMap: boolean[][];
}

export interface GameBotEntry {
  position: [0, 0];
  botBrainData: string;
  uId: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseLobbyService {
  lobbyFirebaseRef;
  lobbys: Map<string, LobbyRef> = new Map();

  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

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

    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
    });

    auth.onAuthStateChanged((user) => {
      this.store.dispatch(new SetFirebaseUser(user));
      if (!user && this.currentLobby) {
        console.log('user logged out');
        router.navigate(['']);
      }
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  updatePlayer(player: Player | undefined) {
    if (this.currentLobby && player) {
      this.db.database
        .ref()
        .child('/lobbys/' + this.currentLobby.settings.id + '/player')
        .child(player.uId)
        .update(player);
    } else {
      console.log('Error: cant update Player (no lobby / player)');
    }
  }

  generateNewLobby() {
    console.log('newLobby');
    if (!this.firebaseUser) {
      this.auth
        .signInAnonymously()
        .then(() => {
          let id = this.getNewSessionId(5);

          let roboName =
            environment.roboNames[
              Math.floor(Math.random() * environment.roboNames.length)
            ];

          let colorId = environment.roboNames.indexOf(roboName) * 2 + 3;

          let player: Player = {
            uId: this.firebaseUser.uid,
            name: roboName,
            isReady: false,
            colorId: colorId,
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
            obstacles: true,
            speed: 20,
            gameStarted: false,
            editorEndTimeStamp: new Date(),
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

  generateUniqueRobot(): string {
    if (this.currentLobby) {
      let nameFound: boolean = false;
      let roboName = '';
      while (!nameFound) {
        roboName =
          environment.roboNames[
            Math.floor(Math.random() * environment.roboNames.length)
          ];
        nameFound = true;
        this.currentLobby.player.forEach((value: Player) => {
          if (value.name == roboName) {
            nameFound = false;
          }
        });
      }

      return roboName;
    }

    return '';
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
