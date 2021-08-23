import { SimulationService } from './simulation.service';
import { AppState } from './../store/app.state';
import { SetFirebaseUser, SetCurrentLobby } from './../store/app.action';
import {
  Player,
  LobbyRef,
  GameState,
  LobbyRefSettings,
  GameBotEntry,
} from './firebase-lobby.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { remove } from 'lodash';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

export interface User {
  uid: string;
  lastSeen: string;
  lobbyId: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  lobbys: Map<string, LobbyRef> = new Map();

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  currentLobbySubsription: Subscription | undefined;

  gameState: GameState | undefined = undefined;

  private initialUserChecked: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private store: Store,
    private simulationService: SimulationService,
    private alert: AlertService
  ) {
    this.firebaseUser$.subscribe((fuser: any) => {
      this.firebaseUser = fuser;
    });

    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
      if (this.currentLobby?.gameState != this.gameState) {
        this.setGameState();
      }
    });
    let lobbysFirebaseRef = db.object('lobbys').valueChanges();
    lobbysFirebaseRef.subscribe((changes: any) => {
      if (changes) {
        changes.player = this.formatPlayerToMap(changes.player);
        this.lobbys = this.jsonToMap(changes);
      }
    });

    auth.onAuthStateChanged((user) => {
      console.log(user);
      this.store.dispatch(new SetFirebaseUser(user));
      if (this.initialUserChecked) {
        if (!user) {
          this.removeUser();
          this.router.navigate(['']);
        } else {
          this.setGameState();
        }
      } else {
        this.initialUserChecked = true;
        this.checkAuth();
      }
    });

    setInterval(() => {
      this.updateUserOnline();
    }, 1000);
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

  checkAuth() {
    if (this.firebaseUser) {
      this.getUser(this.firebaseUser.uid)
        .then((snap) => {
          if (snap.exists()) {
            if (snap.val().uid) {
              console.log('user found');
              console.log(snap.val());
              this.getLobby(snap.val().lobbyId).then((lobbySnap) => {
                if (lobbySnap.exists()) {
                  console.log('lobby found');
                  console.log(lobbySnap.val());
                  this.setGameState();
                  this.router.navigate(['game']);
                } else {
                  console.log("lobby doesn't exist in database!");
                  this.auth.signOut();
                }
              });
            } else {
              console.log("user doesn't exist in database!");
              this.auth.signOut();
            }
          } else {
            console.log("user doesn't exist in database!");
            this.auth.signOut();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('user not logged in!');
      this.removeUser();
      this.router.navigate(['']);
    }
  }

  getGame(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('games/' + id)
      .get();
  }

  getLobby(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('lobbys/' + id)
      .get();
  }

  updateGameState(state: GameState) {
    if (this.currentLobby) {
      this.db.database
        .ref()
        .child('/lobbys/' + this.currentLobby.settings.id + '/gameState')
        .set(state)
        .then(() => {
          this.setGameState();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  updateLobbySettings(l: LobbyRefSettings) {
    console.log('update L');
    if (this.currentLobby) {
      this.db.database
        .ref()
        .child('lobbys/' + this.currentLobby.settings.id)
        .get()
        .then((snap) => {
          if (snap.exists()) {
            if (snap.val().gameState && this.currentLobby) {
              this.db.database
                .ref()
                .child('/lobbys/' + this.currentLobby.settings.id + '/settings')
                .update(l);
            }
          }
        });
    }
  }

  getUser(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('user/' + id)
      .get();
  }

  setNewUser(lobbyId: string) {
    let newUser: User = {
      lastSeen: new Date().toUTCString(),
      lobbyId: lobbyId,
      uid: this.firebaseUser.uid,
    };
    console.log(newUser);
    this.db.database
      .ref()
      .child('user/' + this.firebaseUser.uid)
      .set(newUser);
  }

  logout() {
    this.removeUser();
    this.resetVars();
    this.auth.signOut();
    this.router.navigate(['']);
  }

  resetVars() {
    if (this.currentLobbySubsription) {
      this.currentLobbySubsription.unsubscribe();
    }

    this.currentLobby = undefined;
    this.gameState = undefined;
  }

  removeUser() {
    if (this.firebaseUser) {
      this.removeUserFromGame(this.firebaseUser.uid);
      this.removeUserFromLobby(this.firebaseUser.uid);

      this.db.database
        .ref()
        .child('user/' + this.firebaseUser.uid)
        .remove();

      this.gameState = undefined;
      this.store.dispatch(new SetFirebaseUser(undefined));
      this.store.dispatch(new SetCurrentLobby(undefined));
    } else {
      console.log('Error: no firebaseUser found');
    }
  }

  removeUserFromGame(uid: string) {
    if (this.currentLobby) {
      console.log('removing from game');
      this.db.database
        .ref()
        .child('games/' + this.currentLobby.settings.id + '/playerBots')
        .child(uid)
        .set(null)
        .then(() => {
          console.log('removed from Game');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('Error: cant kick Player (no lobby)');
    }
  }

  removeUserFromLobby(uid: string) {
    if (this.currentLobby) {
      console.log('removing from Lobby');
      console.log(uid);
      console.log(this.currentLobby.settings.id);
      this.db.database
        .ref()
        .child('/lobbys/' + this.currentLobby.settings.id + '/player')
        .child(uid)
        .set(null)
        .then(() => {
          console.log('removed from Lobby');
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log('Error: cant kick Player (no lobby)');
    }
  }

  updateUserOnline() {
    if (this.firebaseUser) {
      this.getUser(this.firebaseUser.uid).then((userSnap) => {
        if (userSnap.exists() && userSnap.val().uid) {
          this.db.database
            .ref()
            .child('user/' + this.firebaseUser.uid)
            .child('lastSeen')
            .set(new Date().toUTCString())
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("Error: Cant update timestamp! User doesn't exist!");
          this.logout();
        }
      });
    }
  }

  setGame() {
    if (this.currentLobby) {
      if (this.firebaseUser.uid == this.currentLobby.adminUid) {
        this.db.database
          .ref()
          .child('/games/' + this.currentLobby.settings.id)
          .child('obstacleMap')
          .update(
            this.simulationService.generateObstacleMap(
              [
                this.currentLobby.settings.mapSize,
                this.currentLobby.settings.mapSize,
              ],
              this.currentLobby.settings.obstacles,
              this.currentLobby.settings.obstacleSettings
            )
          );
      }
    }
  }

  submitBot(bot: GameBotEntry): Promise<any> {
    if (this.currentLobby) {
      return this.db.database
        .ref()
        .child('/games/' + this.currentLobby.settings.id + '/playerBots')
        .child(this.firebaseUser.uid)
        .update(bot);
    } else {
      throw 'no Lobby';
    }
  }

  setGameState() {
    this.getUser(this.firebaseUser.uid).then((userSnap) => {
      if (userSnap.exists()) {
        this.getLobby(userSnap.val().lobbyId).then((lobbySnap) => {
          if (lobbySnap.exists()) {
            console.log('lobby Found');
            this.gameState = lobbySnap.val().gameState;
            console.log(this.currentLobby);

            if (this.currentLobbySubsription) {
              this.currentLobbySubsription.unsubscribe();
            }

            let lobbyRef = this.db
              .object('lobbys/' + lobbySnap.val().settings.id)
              .valueChanges();
            this.currentLobbySubsription = lobbyRef.subscribe(
              (changes: any) => {
                if (changes) {
                  changes.player = this.formatPlayerToMap(changes.player);
                  this.store.dispatch(new SetCurrentLobby(changes));
                }
              }
            );
          } else {
            console.log('Error: lobby doesnt exist');
          }
        });
      } else {
        console.log('Error: user doesnt exist');
      }
    });
  }

  setNewLobby(lobby: LobbyRef, admin: Player) {
    console.log('set lobby');
    this.alert.notification('Generated new lobby');
    this.db.database
      .ref()
      .child('/lobbys')
      .child(lobby.settings.id)
      .update(lobby)
      .then(() => {
        console.log('set admin');
        this.db.database
          .ref()
          .child('/lobbys/' + lobby.settings.id + '/player')
          .child(admin.uId)
          .update(admin)
          .then(() => {
            this.setGameState();
            this.router.navigate(['game']);
          });
      })
      .catch((e) => {
        console.log(e);
      });
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
