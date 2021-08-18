import { FirebaseLobbyService } from './../../services/firebase-lobby.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-lobby-select',
  templateUrl: './lobby-select.component.html',
  styleUrls: ['./lobby-select.component.scss'],
})
export class LobbySelectComponent implements OnInit {
  constructor(
    private firebaseLobbyService: FirebaseLobbyService,
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  createNewLobby() {
    this.firebaseLobbyService.generateNewLobby();
  }

  clearAuth() {
    console.log('signed Out');
    this.auth.signOut();
  }
}
