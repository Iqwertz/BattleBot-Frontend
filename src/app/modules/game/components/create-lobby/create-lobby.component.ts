import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { SetCurrentLobby, SetFirebaseUser } from '../../../../store/app.action';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  LobbyRef,
  Player,
  FirebaseLobbyService,
} from '../../../../services/firebase/firebase-lobby.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../../../store/app.state';
import { environment } from '../../../../../environments/environment';
import { LobbyRefSettings } from '../../../../services/firebase/firebase-lobby.service';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss'],
})
export class CreateLobbyComponent implements OnInit, OnDestroy {
  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  currentLobbyId: string | null = null;

  gameStarted = false;

  loggedIn: boolean = false;
  leavingCalled: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fireBaseLobbyService: FirebaseLobbyService,
    private firebaseService: FirebaseService,
    private store: Store
  ) {}

  ngOnInit(): void {
    console.log('init');

    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  lobbySettingChanged(l: LobbyRefSettings) {
    this.firebaseService.updateLobbySettings(l);
  }

  startGame() {
    console.log('starting Game');
    if (this.currentLobby) {
      this.currentLobby.settings.gameStarted = true;
      this.currentLobby.settings.editorEndTimeStamp = new Date(
        new Date().getTime() + this.currentLobby.settings.editorTime * 60000
      );
      console.log(this.currentLobby.settings);
      this.firebaseService.updateLobbySettings(this.currentLobby.settings);
      this.firebaseService.updateGameState('editor');
    }
  }

  checkPlayerReady(): boolean {
    if (this.currentLobby) {
      let isNotReady = false;
      Array.from(this.currentLobby.player.values()).map((value) => {
        if (!value.isReady) {
          isNotReady = true;
        }
      });

      return !isNotReady;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    console.log('destroy');
    if (!this.gameStarted) {
      //  this.leaveLobby();
    }
  }
  /*
    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler(event: any) {
      console.log('unload');
      this.leaveLobby();
    }

    leaveLobby() {
      console.log('leaving');

      if (this.leavingCalled) {
        return
      }

      this.leavingCalled = true;

      if (!this.currentLobby) {
        console.log('no lobby');
        this.auth.signOut();
        return;
      }
      alert(this.currentLobby.player.size)
      if (this.currentLobby.player.size <= 1) {
        this.db.database
          .ref()
          .child('/lobbys')
          .child(this.currentLobbyId!)
          .remove()
          .catch((er) => {
            console.log(er);
          });
        this.auth.signOut();
        this.store.dispatch(new SetCurrentLobby(undefined));
        this.store.dispatch(new SetFirebaseUser(undefined));
      } else if (this.currentLobby!.adminUid == this.firebaseUser.uid) {
        let keyFound = false;
        let randomPlayerKey: string = '';
        while (!keyFound) {
          randomPlayerKey = this.getRandomKey(this.currentLobby!.player);
          if (randomPlayerKey != this.firebaseUser.uid) {
            keyFound = true;
          }
        }

        let newAdmin = this.currentLobby!.player.get(randomPlayerKey);

        if (newAdmin) {
          this.db.database
            .ref()
            .child('/lobbys/' + this.currentLobbyId)
            .update({ adminUid: newAdmin.uId }).then(() => {
              this.db.database
                .ref()
                .child('/lobbys/' + this.currentLobbyId + '/player')
                .child(this.firebaseUser.uid)
                .remove()
                .then(() => {
                  this.auth.signOut();
                });

              this.store.dispatch(new SetCurrentLobby(undefined));
              this.store.dispatch(new SetFirebaseUser(undefined));
            });
        }
      } else {
        this.db.database
          .ref()
          .child('/lobbys/' + this.currentLobbyId + '/player')
          .child(this.firebaseUser.uid)
          .remove()
          .then(() => {
            this.auth.signOut().then(() => { });
          });

        this.store.dispatch(new SetCurrentLobby(undefined));
        this.store.dispatch(new SetFirebaseUser(undefined));
      }
    } */

  // returns random key from Set or Map
  getRandomKey(collection: any): string {
    let keys: string[] = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }

  getObjectLength(obj: any): number {
    if (obj) {
      return Object.keys(obj).length;
    } else {
      return -1;
    }
  }
}
