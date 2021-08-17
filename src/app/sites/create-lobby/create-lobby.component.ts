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

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss'],
})
export class CreateLobbyComponent implements OnInit {
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
    private fireBaseLobbyService: FirebaseLobbyService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      //has to be spilt in small functions
      this.currentLobbyId = params.get('id');
      if (this.currentLobbyId) {
        let lobbyRef = db
          .object('lobbys/' + this.currentLobbyId)
          .valueChanges();
        lobbyRef.subscribe((changes: any) => {
          this.lobby = changes;
          this.lobby!.player = fireBaseLobbyService.formatPlayerToMap(
            changes.player
          );
        });

        this.firebaseUser$.subscribe((user: any) => {
          this.firebaseUser = user;
          console.log(this.loggedIn);
          if (!this.firebaseUser && !this.loggedIn) {
            this.loggedIn = true;
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
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      //router events
      if (event instanceof NavigationStart) {
        //do something on start activity
      }

      if (event instanceof NavigationError) {
        console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
        this.leaveLobby();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    this.leaveLobby();
  }

  leaveLobby() {
    this.db.database
      .ref()
      .child('/lobbys/' + this.currentLobbyId + '/player')
      .child(this.firebaseUser.uid)
      .remove();

    this.auth.signOut();
  }
}
