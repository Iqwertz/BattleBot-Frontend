import { SetCurrentLobby } from './../../store/app.action';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  LobbyRef,
  Player,
  FirebaseLobbyService,
} from '../../services/firebase-lobby.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import { environment } from '../../../environments/environment';
import { LobbyRefSettings } from '../../services/firebase-lobby.service';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss'],
})
export class CreateLobbyComponent implements OnInit, OnDestroy {
  lobby: LobbyRef | undefined;
  currentLobbyId: string | null = null;

  gameStarted = false;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;
  loggedIn: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    fireBaseLobbyService: FirebaseLobbyService,
    private store: Store
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      //has to be spilt in small functions
      this.currentLobbyId = params.get('id');
      if (this.currentLobbyId) {
        console.log(this.currentLobbyId);
        db.database
          .ref()
          .child('lobbys/' + this.currentLobbyId)
          .get()
          .then((snap) => {
            auth.currentUser.then((user) => {
              if (!user && snap.exists()) {
                console.log('signing In');
                this.auth
                  .signInAnonymously()
                  .then(() => {
                    if (
                      snap.val().settings.maxPlayer >
                      this.getObjectLength(snap.val().player)
                    ) {
                      let roboName = fireBaseLobbyService.generateUniqueRobot();

                      let colorId =
                        environment.roboNames.indexOf(roboName) * 2 + 3;

                      let player: Player = {
                        uId: this.firebaseUser.uid,
                        name: environment.roboNames[
                          Math.floor(
                            Math.random() * environment.roboNames.length
                          )
                        ],
                        isReady: false,
                        colorId: colorId,
                      };
                      this.db.database
                        .ref()
                        .child('/lobbys/' + this.currentLobbyId + '/player')
                        .child(player.uId)
                        .update(player);
                    } else {
                      console.log('lobby is full');
                      auth.signOut();
                      this.router.navigate(['']);
                    }
                  })
                  .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                  });
              } else if (!snap.exists()) {
                console.log('This lobby doesn`t exist');
                auth.signOut();

                this.router.navigate(['']);
              }
            });
          })
          .catch((er) => {
            console.log(er);
          });

        let lobbyRef = db
          .object('lobbys/' + this.currentLobbyId)
          .valueChanges();
        lobbyRef.subscribe((changes: any) => {
          if (changes) {
            this.lobby = changes;
            this.store.dispatch(new SetCurrentLobby(this.lobby));
            this.lobby!.player = fireBaseLobbyService.formatPlayerToMap(
              changes.player
            );
            if (this.lobby!.settings.gameStarted == true) {
              this.gameStarted = true;
              this.router.navigate(['editor']);
            }

            console.log(this.lobby);
            console.log(this.firebaseUser);
            if (this.lobby && this.firebaseUser) {
              if (!this.lobby.player.has(this.firebaseUser.uid)) {
                console.log('You got kicked!');
                router.navigate(['']);
              }
            }
          }
        });
      }
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  ngOnInit(): void {}

  lobbySettingChanged(l: LobbyRefSettings) {
    this.db.database
      .ref()
      .child('/lobbys/' + this.currentLobbyId + '/settings')
      .update(l);
  }

  startGame() {
    if (this.lobby) {
      this.lobby.settings.gameStarted = true;
      this.lobby.settings.editorEndTimeStamp = new Date(
        new Date().getTime() + this.lobby.settings.editorTime * 60000
      );
      this.lobbySettingChanged(this.lobby.settings);
    }
  }

  checkPlayerReady(): boolean {
    if (this.lobby) {
      let isNotReady = false;
      Array.from(this.lobby.player.values()).map((value) => {
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
      this.leaveLobby();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    console.log('unload');
    this.leaveLobby();
  }

  leaveLobby() {
    console.log('leaving');

    if (!this.lobby) {
      console.log('no lobby');
      this.auth.signOut();
      return;
    }

    if (this.lobby.player.size <= 1) {
      this.db.database
        .ref()
        .child('/lobbys')
        .child(this.currentLobbyId!)
        .remove()
        .catch((er) => {
          console.log(er);
        });
    } else if (this.lobby?.adminUid == this.firebaseUser.uid) {
      let keyFound = false;
      let randomPlayerKey: string = '';
      while (!keyFound) {
        randomPlayerKey = this.getRandomKey(this.lobby!.player);
        if (randomPlayerKey != this.firebaseUser.uid) {
          keyFound = true;
        }
      }

      let newAdmin = this.lobby!.player.get(randomPlayerKey);

      if (newAdmin) {
        this.db.database
          .ref()
          .child('/lobbys/' + this.currentLobbyId)
          .update({ adminUid: newAdmin.uId });
      }
    }

    this.db.database
      .ref()
      .child('/lobbys/' + this.currentLobbyId + '/player')
      .child(this.firebaseUser.uid)
      .remove()
      .then(() => {
        this.auth.signOut();
      });

    this.store.dispatch(new SetCurrentLobby(undefined));
  }

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
