import { SimulationService } from '../simulation/simulation.service';
import { AppState } from '../../store/app.state';
import { SetFirebaseUser, SetCurrentLobby } from '../../store/app.action';
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
import { Subscription } from 'rxjs';
import { AlertService } from '../alert.service';
import { environment } from '../../../environments/environment';

export interface User {
  uid: string;
  lastSeen: string;
  lobbyId: string;
}

/**
 *manages all firebase login actions, a flowchart describing the loginsystem: https://miro.com/app/board/o9J_l1SscUw=/
 *
 * @export
 * @class FirebaseService
 */
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

  private failedTimestampUpdateAttempts: number = 0;

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
          console.log('no user');
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

  /**
   *converts a json to a map
   *
   * @param {*} json
   * @return {*}  {Map<string, any>}
   * @memberof FirebaseService
   */
  jsonToMap(json: any): Map<string, any> {
    let map = new Map();
    for (let key in json) {
      map.set(key, json[key]);
    }
    return map;
  }

  /**
   *check current auth state and register user when an existing user is found in firebase
   *
   * @memberof FirebaseService
   */
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

  /**
   *get a game from firebase
   *
   * @param {string} id
   * @return {*}  {Promise<any>}
   * @memberof FirebaseService
   */
  getGame(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('games/' + id)
      .get();
  }

  /**
   *get a lobby from firebase
   *
   * @param {string} id
   * @return {*}  {Promise<any>}
   * @memberof FirebaseService
   */
  getLobby(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('lobbys/' + id)
      .get();
  }

  /**
   *update the gamestate in firebase
   *
   * @param {GameState} state
   * @memberof FirebaseService
   */
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

  /**
   *update the settings of the current lobby in firebase
   *
   * @param {LobbyRefSettings} l
   * @memberof FirebaseService
   */
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

  /**
   *get a user from firebase
   *
   * @param {string} id
   * @return {*}  {Promise<any>}
   * @memberof FirebaseService
   */
  getUser(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('user/' + id)
      .get();
  }

  /**
   *sets the current user to a firebase lobby
   *
   * @param {string} lobbyId
   * @memberof FirebaseService
   */
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

  /**
   *logs the current user out and navigate to landing
   *
   * @memberof FirebaseService
   */
  logout() {
    console.log('logout');
    this.removeUser();
    this.resetVars();
    this.auth.signOut();
    this.router.navigate(['']);
  }

  /**
   *reset current vars (cutting the connection to firebase)
   *
   * @memberof FirebaseService
   */
  resetVars() {
    if (this.currentLobbySubsription) {
      this.currentLobbySubsription.unsubscribe();
    }

    this.currentLobby = undefined;
    this.gameState = undefined;
  }

  /**
   *reset the positon of the bot in firebase
   *
   * @memberof FirebaseService
   */
  resetBotPositions() {
    this.currentLobby?.player.forEach((val: Player, key: string) => {
      this.db.database
        .ref()
        .child(
          '/games/' + this.currentLobby?.settings.id + '/playerBots/' + key
        )
        .child('position')
        .set([0, 0]);
    });
  }

  /**
   *remove the own user from the game, lobby and user objects in the firebase
   *
   * @memberof FirebaseService
   */
  removeUser() {
    console.log('removing user');
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

  /**
   *removes a user from the current game in firebase
   *
   * @param {string} uid
   * @memberof FirebaseService
   */
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

  /**
   *removes a user from the current lobby in firebase
   *
   * @param {string} uid
   * @memberof FirebaseService
   */
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

  /**
   *updates the timestamp of the current user, when the timestamp cant be set (due to server removal) user will be logged out
   *
   * @memberof FirebaseService
   */
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

          this.failedTimestampUpdateAttempts = 0;
        } else {
          console.log("Error: Cant update timestamp! User doesn't exist!");
          this.failedTimestampUpdateAttempts++;
          console.log(this.failedTimestampUpdateAttempts);
          if (
            this.failedTimestampUpdateAttempts >=
            environment.maxTimestampUpdateFails
          ) {
            this.logout();
            this.failedTimestampUpdateAttempts = 0;
          }
        }
      });
    }
  }

  /**
   *updates the obstaclemap of a game in the firebase
   *
   * @memberof FirebaseService
   */
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

  /**
   *submits a bot to the firebase, with the current firebaseuser uid
   *
   * @param {GameBotEntry} bot the bot to submit
   * @return {*}  {Promise<any>}
   * @memberof FirebaseService
   */
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

  /**
   *checks the current state of the game and updates the variables accordingly
   *
   * @memberof FirebaseService
   */
  setGameState() {
    this.getUser(this.firebaseUser.uid).then((userSnap) => {
      if (userSnap.exists()) {
        //check if user exists
        this.getLobby(userSnap.val().lobbyId).then((lobbySnap) => {
          if (lobbySnap.exists()) {
            //check if the lobby exists
            console.log('lobby Found');
            this.gameState = lobbySnap.val().gameState; //get the gameState

            if (this.currentLobbySubsription) {
              this.currentLobbySubsription.unsubscribe(); //unsubsribe from previous lobby observable
            }

            let lobbyRef = this.db
              .object('lobbys/' + lobbySnap.val().settings.id)
              .valueChanges();
            this.currentLobbySubsription = lobbyRef.subscribe(
              //subsribe to the lobby changes
              (changes: any) => {
                if (changes) {
                  changes.player = this.formatPlayerToMap(changes.player);
                  this.store.dispatch(new SetCurrentLobby(changes)); //set the lobbystore
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

  /**
   *sets a new Lobby in firebase, and navigates to the game on success
   *
   * @param {LobbyRef} lobby the lobby to set
   * @param {Player} admin the player object of the admin
   * @memberof FirebaseService
   */
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

  /**
   *generate unique sessionId
   *
   * @param {number} digits digits of the id
   * @return {*}
   * @memberof FirebaseService
   */
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
