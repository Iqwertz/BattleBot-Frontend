import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  LobbyRef,
  Player,
  FirebaseLobbyService,
} from '../../services/firebase-lobby.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import { environment } from '../../../environments/environment';

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

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fireBaseLobbyService: FirebaseLobbyService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      //get Id route parameter
      this.currentLobbyId = params.get('id');

      let lobbyRef = db.object('lobbys/' + this.currentLobbyId).valueChanges();
      lobbyRef.subscribe((changes: any) => {
        this.lobby = changes;
        this.lobby!.player = fireBaseLobbyService.formatPlayerToMap(
          changes.player
        );
      });
    });

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
      if (!this.firebaseUser) {
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
      console.log(this.firebaseUser);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //this.auth.signOut();
  }
}
