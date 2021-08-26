import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { AppState } from './../../store/app.state';
import { Select } from '@ngxs/store';
import { User } from '../../services/firebase/firebase.service';
import {
  FirebaseLobbyService,
  Player,
  LobbyRefSettings,
  LobbyRef,
} from '../../services/firebase/firebase-lobby.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-lobby-select',
  templateUrl: './lobby-select.component.html',
  styleUrls: ['./lobby-select.component.scss'],
})
export class LobbySelectComponent implements OnInit {
  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  constructor(
    private firebaseLobbyService: FirebaseLobbyService,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private router: Router,
    private alert: AlertService
  ) {
    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  ngOnInit(): void {}

  createNewLobby() {
    //this.firebaseLobbyService.generateNewLobby();
    this.generateNewLobby();
  }

  error() {
    this.alert.error('test');
  }

  note() {
    this.alert.notification('note');
  }

  generateNewLobby() {
    console.log('newLobby');

    let id = this.firebaseService.getNewSessionId(5);

    this.auth.signInAnonymously().then(() => {
      this.firebaseService.setNewUser(id);

      let roboName =
        environment.roboNames[
          Math.floor(Math.random() * environment.roboNames.length)
        ];

      let colorId = environment.roboNames.indexOf(roboName) * 2 + 3;

      let player: Player = {
        uId: this.firebaseUser.uid,
        name: roboName,
        isReady: false,
        colorId: colorId,
      };

      let settings: LobbyRefSettings = {
        editorTime: environment.defaultLobby.editorTime,
        id: id,
        maxPlayer: environment.defaultLobby.maxPlayer,
        name: roboName + 's arena',
        private: environment.defaultLobby.private,
        simulationTime: environment.defaultLobby.simulationTime,
        mode: 'Color',
        mapSize: environment.defaultMapSize[0],
        obstacleSettings: environment.obstacleNoiseSettings,
        obstacles: true,
        speed: 20,
        gameStarted: false,
        editorEndTimeStamp: new Date(
          new Date().getTime() + 48 * 60 * 60 * 1000
        ),
        simulationSteps: 0,
      };

      console.log(this.firebaseUser.uid);

      let newLobby: LobbyRef = {
        settings: settings,
        adminUid: this.firebaseUser.uid,
        player: new Map(),
        gameState: 'lobby',
      };

      console.log(newLobby);

      this.firebaseService.setNewLobby(newLobby, player);
    });
  }
}
