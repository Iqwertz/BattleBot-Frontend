import { FirebaseService } from 'src/app/services/firebase.service';
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
  simulationSteps: number;
}

export type GameState = 'lobby' | 'editor' | 'play'

export interface LobbyRef {
  settings: LobbyRefSettings;
  player: Map<string, Player>;
  adminUid: string;
  gameState: GameState;
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
    private store: Store,
    private firebaseService: FirebaseService
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

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  updatePlayer(player: Player | undefined) {
    console.log(player)
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

  kickPlayer(id: string) {
    if (this.currentLobby) {
      this.db.database
        .ref()
        .child('/lobbys/' + this.currentLobby.settings.id + '/player')
        .child(id)
        .set(null)
        .then(() => {
          console.log('kicked Player');
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log('Error: cant kick Player (no lobby)');
    }
  }

  joinLobby(id: string) {
    this.firebaseService.getLobby(id).then((lobbySnap) => {
      if (lobbySnap.exists()) {
        if (this.firebaseService.formatPlayerToMap(lobbySnap.val().player).size < lobbySnap.val().settings.maxPlayer) {
          this.auth.signInAnonymously().then(() => {
            if (this.firebaseUser) {
              this.firebaseService.setNewUser(id);

              let roboName = this.generateUniqueRobot(this.firebaseService.formatPlayerToMap(lobbySnap.val().player));
              let colorId = environment.roboNames.indexOf(roboName) * 2 + 3;

              let player: Player = {
                uId: this.firebaseUser.uid,
                name: roboName,
                isReady: false,
                colorId: colorId,
              };

              console.log(this.firebaseUser.uid);

              this.db.database
                .ref()
                .child('/lobbys/' + id + '/player')
                .child(this.firebaseUser.uid)
                .update(player)
                .then(() => {
                  this.firebaseService.setGameState();
                  this.router.navigate(['game']);
                });
            } else {
              console.log("Error: Sign In failed")
            }
          })

        } else {
          console.log("Error: Lobby full")
        }
      }
    })
  }

  generateUniqueRobot(player: Map<string, Player>): string {
    console.log(this.currentLobby)

    let nameFound: boolean = false;
    let roboName = '';
    while (!nameFound) {
      roboName =
        environment.roboNames[
        Math.floor(Math.random() * environment.roboNames.length)
        ];
      nameFound = true;
      player.forEach((value: Player) => {
        if (value.name == roboName) {
          nameFound = false;
        }
      });
    }

    return roboName;
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
