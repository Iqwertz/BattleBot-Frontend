import { AppState } from './../store/app.state';
import { SetFirebaseUser } from './../store/app.action';
import { Player, LobbyRef } from './firebase-lobby.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

export interface User {
  uid: string;
  lastSeen: string;
  lobbyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  lobbyFirebaseRef;
  lobbys: Map<string, LobbyRef> = new Map();

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  currentLobby: LobbyRef | undefined;

  private initialUserChecked: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private store: Store) {

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });

    this.lobbyFirebaseRef = db.object('lobbys').valueChanges();
    this.lobbyFirebaseRef.subscribe((changes: any) => {
      if (changes) {
        changes.player = this.formatPlayerToMap(changes.player);
        this.lobbys = this.jsonToMap(changes);
      }
    });


    auth.onAuthStateChanged((user) => {
      console.log(user)
      this.store.dispatch(new SetFirebaseUser(user));
      if (this.initialUserChecked) {
        if (!user) {
          this.router.navigate([''])
        }
      } else {
        this.initialUserChecked = true;
        this.checkAuth();
      }
    });

    setInterval(() => { this.updateUserOnline() }, 1000)
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
      this.getUser(this.firebaseUser.uid).then((snap) => {
        if (snap.exists()) {
          if (snap.val().uid) {
            console.log("user found")
            console.log(snap.val())
            this.getLobby(snap.val().lobbyId).then((lobbySnap) => {
              if (lobbySnap.exists()) {
                console.log("lobby found");
                console.log(lobbySnap.val());

              } else {
                console.log("lobby doesn't exist in database!")
                this.auth.signOut();
              }
            })
          } else {
            console.log("user doesn't exist in database!")
            this.auth.signOut();
          }
        } else {
          console.log("user doesn't exist in database!")
          this.auth.signOut();
        }
      }).catch((error) => {
        console.log(error)
      })
    } else {
      console.log('user not logged in!')
      this.router.navigate([''])
    }
  }

  getLobby(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('lobbys/' + id)
      .get()
  }

  getUser(id: string): Promise<any> {
    return this.db.database
      .ref()
      .child('user/' + id)
      .get()
  }

  setNewUser(lobbyId: string) {
    let newUser: User = {
      lastSeen: new Date().toUTCString(),
      lobbyId: lobbyId,
      uid: this.firebaseUser.uid
    }
    console.log(newUser)
    this.db.database.ref().child('user/' + this.firebaseUser.uid).set(newUser);
  }

  updateUserOnline() {
    if (this.firebaseUser) {
      this.db.database.ref().child('user/' + this.firebaseUser.uid).child('lastSeen').set(new Date().toUTCString()).catch((error) => {
        console.log(error)
      });
    }
  }

  setNewLobby(lobby: LobbyRef, admin: Player) {
    console.log('set lobby');
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
