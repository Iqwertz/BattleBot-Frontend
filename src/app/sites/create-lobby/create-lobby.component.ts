import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  LobbyRef,
  Player,
  FirebaseLobbyService,
} from '../../services/firebase-lobby.service';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Select } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import { environment } from '../../../environments/environment';
import { Collection, update } from 'lodash';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss'],
})
export class CreateLobbyComponent implements OnInit, OnDestroy {
  lobby: LobbyRef | undefined;
  currentLobbyId: string | null = null;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;
  loggedIn: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    fireBaseLobbyService: FirebaseLobbyService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      //has to be spilt in small functions
      this.currentLobbyId = params.get('id');
      if (this.currentLobbyId) {
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
                    let player: Player = {
                      uId: this.firebaseUser.uid,
                      name: environment.roboNames[
                        Math.floor(Math.random() * environment.roboNames.length)
                      ],
                    };
                    this.db.database
                      .ref()
                      .child('/lobbys/' + this.currentLobbyId + '/player')
                      .child(player.uId)
                      .update(player);
                  })
                  .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                  });
              } else if (!snap.exists()) {
                auth.signOut();
                console.log('This lobby doesn`t exist');
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
            this.lobby!.player = fireBaseLobbyService.formatPlayerToMap(
              changes.player
            );
          }
        });
      }
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
      //console.log(this.loggedIn);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.leaveLobby();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
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
  }

  // returns random key from Set or Map
  getRandomKey(collection: any): string {
    let keys: string[] = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }
}
