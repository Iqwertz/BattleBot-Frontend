import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { toString } from 'lodash';
import { Router, RouterModule } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store, Select } from '@ngxs/store';
import { SetFirebaseUser } from '../store/app.action';
import { AppState } from '../store/app.state';

export interface LobbyRef {
  editorTime: number;
  id: string;
  name: string;
  private: boolean;
  simulationTime: number;
  maxPlayer: number;
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
      this.lobbys = this.jsonToMap(changes);
    });

    auth.onAuthStateChanged((user) => {
      this.store.dispatch(new SetFirebaseUser(user));
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  generateNewLobby() {
    this.auth
      .signInAnonymously()
      .then(() => {
        console.log(this.firebaseUser);

        let id = this.getNewSessionId(5);

        let newLobby: LobbyRef = {
          editorTime: environment.defaultLobby.editorTime,
          id: id,
          maxPlayer: environment.defaultLobby.maxPlayer,
          name: '',
          private: environment.defaultLobby.private,
          simulationTime: environment.defaultLobby.simulationTime,
          adminUid: this.firebaseUser.uid,
        };

        this.db.database.ref().child('/lobbys').child(id).update(newLobby);

        this.router.navigate(['createLobby', id]);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }

  private jsonToMap(json: any): Map<string, any> {
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
