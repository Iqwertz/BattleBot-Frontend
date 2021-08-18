import { FirebaseLobbyService } from './../../services/firebase-lobby.service';
import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-lobby-select',
  templateUrl: './lobby-select.component.html',
  styleUrls: ['./lobby-select.component.scss'],
})
export class LobbySelectComponent implements OnInit {
  constructor(private firebaseLobbyService: FirebaseLobbyService) {}

  ngOnInit(): void {}

  createNewLobby() {
    this.firebaseLobbyService.generateNewLobby();
  }
}
